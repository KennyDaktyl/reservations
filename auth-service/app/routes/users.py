from flask import Blueprint, jsonify, request
from flask_restx import Api, Resource, fields
from marshmallow import ValidationError

from app.repositories.user_repository import UserRepository
from app.schemas.user_schema import UserResponseSchema, UserSchema

user_bp = Blueprint("users", __name__)
api = Api(
    user_bp,
    doc="/docs",
    title="User API",
    description="API for managing users",
)

user_create_model = api.model(
    "CreateUser",
    {
        "email": fields.String(required=True, description="Email of the user"),
        "password": fields.String(
            required=True, description="Password of the user"
        ),
        "role": fields.String(default="user", description="Role of the user"),
    },
)

user_out_model = api.model(
    "UserOut",
    {
        "id": fields.Integer(description="User ID", required=True),
        "email": fields.String(description="User Email", required=True),
        "role": fields.String(description="User Role", required=True),
    },
)

user_schema = UserSchema()
user_response_schema = UserResponseSchema()
user_create_schema = UserSchema(only=["email", "password", "role"])


@api.route("/add")
class CreateUser(Resource):
    @api.expect(user_create_model)
    @api.response(201, "User successfully created", user_out_model)
    @api.response(400, "Invalid input")
    @api.response(500, "Error saving user")
    def post(self):
        """Create a new user"""
        schema = UserSchema(only=["email", "password", "role"])

        try:
            validated_data = schema.load(request.json)
        except ValidationError as err:
            return {"errors": err.messages}, 400

        if UserRepository.get_by_email(validated_data["email"]):
            return {"message": "User with this email already exists."}, 400

        try:
            new_user = UserRepository.create_user(**validated_data)
        except Exception as e:
            return {"message": f"Error saving user: {str(e)}"}, 500

        return user_response_schema.dump(new_user), 201