from flask import Blueprint, request
from flask_restx import Api, Resource, fields
from marshmallow import ValidationError

from app.repositories.auth_repository import AuthRepository
from app.schemas.user_schema import UserResponseSchema, UserSchema

auth_bp = Blueprint("auth", __name__)
api = Api(
    auth_bp,
    doc="/docs",
    title="Auth API",
    description="API for user authentication",
)

user_request_schema = api.model(
    "LoginUser",
    {
        "email": fields.String(required=True, description="Email of the user"),
        "password": fields.String(
            required=True, description="Password of the user"
        ),
    },
)

user_out_model = api.model(
    "UserOut",
    {
        "id": fields.Integer(description="User ID", required=True),
        "email": fields.String(description="User Email", required=True),
        "role": fields.String(description="User Role", required=True),
        "access_token": fields.String(
            description="JWT Access Token", required=True
        ),
    },
)


@api.route("/login")
class LoginUser(Resource):
    @api.expect(user_request_schema)
    @api.response(200, "Success", user_out_model)
    @api.response(400, "Invalid input")
    @api.response(401, "Invalid credentials")
    def post(self):
        """Login a user and return JWT token"""
        schema = UserSchema(only=["email", "password"])

        try:
            validated_data = schema.load(request.json)
        except ValidationError as err:
            return {"errors": err.messages}, 400

        result = AuthRepository.authenticate_user(
            validated_data["email"], validated_data["password"]
        )
        if result is None:
            return {"errors": "Invalid credentials"}, 401

        user, access_token = result

        user_response_schema = UserResponseSchema()
        user_data = user_response_schema.dump(user)
        user_data["access_token"] = access_token

        return user_data, 200

