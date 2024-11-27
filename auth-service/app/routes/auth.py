from flask import Blueprint, request
from flask_restx import Api, Resource, fields
from marshmallow import ValidationError

from app.repositories.auth_repository import AuthRepository
from app.schemas.user_schema import UserSchema
from app.repositories.user_repository import UserRepository


auth_bp = Blueprint("auth", __name__)
api = Api(
    auth_bp,
    doc="/docs",
    title="Auth API",
    description="API for user authentication",
)

auth_request_model = api.model(
    "LoginUser",
    {
        "email": fields.String(required=True, description="User's email"),
        "password": fields.String(required=True, description="User's password"),
    },
)

auth_response_model = api.model(
    "AuthResponse",
    {
        "id": fields.Integer(description="User ID", required=True),
        "email": fields.String(description="User Email", required=True),
        "role": fields.String(description="User Role", required=True),
        "access_token": fields.String(description="JWT Access Token", required=True),
    },
)

user_create_model = api.model(
    "CreateUser",
    {
        "email": fields.String(required=True, description="User's email"),
        "password": fields.String(required=True, description="User's password"),
        "role": fields.String(default="user", description="User's role"),
    },
)

user_response_model = api.model(
    "UserResponse",
    {
        "id": fields.Integer(description="User ID", required=True),
        "email": fields.String(description="User Email", required=True),
        "role": fields.String(description="User Role", required=True),
    },
)


@api.route("/login")
class LoginUser(Resource):
    @api.expect(auth_request_model)
    @api.response(200, "Success", auth_response_model)
    @api.response(400, "Invalid input")
    @api.response(401, "Invalid credentials")
    def post(self):
        """Authenticate user and return JWT token"""
        schema = UserSchema(only=["email", "password"])

        try:
            validated_data = schema.load(request.json)
        except ValidationError as err:
            return {"errors": err.messages}, 400

        auth_result = AuthRepository.authenticate_user(
            validated_data["email"], validated_data["password"]
        )
        if not auth_result:
            return {"errors": "Invalid credentials"}, 401

        user, access_token = auth_result
        response_data = {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "access_token": access_token,
        }
        return response_data, 200


@api.route("/create_user")
class CreateUser(Resource):
    @api.expect(user_create_model)
    @api.response(201, "User created successfully", user_response_model)
    @api.response(400, "Invalid input")
    @api.response(409, "User already exists")
    @api.response(500, "Internal server error")
    def post(self):
        """Create a new user"""
        schema = UserSchema(only=["email", "password", "role"])

        try:
            validated_data = schema.load(request.json)
        except ValidationError as err:
            return {"errors": err.messages}, 400

        if UserRepository.get_by_email(validated_data["email"]):
            return {"message": "User with this email already exists."}, 409

        try:
            new_user = UserRepository.create_user(**validated_data)
        except Exception as e:
            return {"message": f"Error saving user: {str(e)}"}, 500

        response_data = {
            "id": new_user.id,
            "email": new_user.email,
            "role": new_user.role,
        }
        return response_data, 201
