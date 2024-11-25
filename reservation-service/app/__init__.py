import json
import logging
import os

from flask import Flask, Response, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, verify_jwt_in_request
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO

from .config import ProductionConfig

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
ma = Marshmallow()
socketio = SocketIO()


def create_app(config_type=None, database_path=None):
    """Funkcja tworząca aplikację Flask."""
    app = Flask(__name__)

    if config_type is None:
        config_type = os.getenv("FLASK_ENV", "development")

    if config_type == "development":
        from .config import DevelopmentConfig

        app.config.from_object(DevelopmentConfig)
    elif config_type == "testing":
        from .config import TestingConfig

        app.config.from_object(TestingConfig)
    elif config_type == "production":
        app.config.from_object(ProductionConfig)

    if database_path:
        app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{database_path}"

    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "default_secret_key")

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)

    CORS(app)

    socketio.init_app(app, cors_allowed_origins="*")
    
    logging.basicConfig(level=logging.INFO)

    @app.before_request
    def verify_token_with_bearer():
        """Weryfikacja tokenu JWT z nagłówka Authorization."""
        public_endpoints = [
            "swagger_ui_doc",
            "swagger_ui_json",
            "swagger_ui_schema",
            "swagger.static",
        ]

        if (
            not request.endpoint
            or request.endpoint in public_endpoints
            or request.endpoint.startswith("swagger")
            or request.path.startswith("/swaggerui/")
            or request.path.startswith("/api/reservations/docs")
            or request.path.startswith("/api/reservations/swagger.json")
        ):
            return

        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            response_body = {
                "message": "Missing 'Bearer' type in 'Authorization' header"
            }
            return Response(
                json.dumps(response_body),
                status=401,
                content_type="application/json",
            )
        try:
            verify_jwt_in_request()
        except Exception as e:
            response_body = {"message": str(e)}
            return Response(
                json.dumps(response_body),
                status=401,
                content_type="application/json",
            )

    @jwt.unauthorized_loader
    def unauthorized_callback(error_message):
        """Obsługa braku nagłówka Authorization."""
        response_body = {"message": "Missing Authorization Header"}
        return Response(
            json.dumps(response_body),
            status=401,
            content_type="application/json",
        )

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        """Obsługa wygaśnięcia tokenu JWT."""
        response_body = {"message": "Token has expired"}
        return Response(
            json.dumps(response_body),
            status=401,
            content_type="application/json",
        )

    @jwt.invalid_token_loader
    def invalid_token_callback(error_message):
        """Obsługa nieprawidłowego tokenu JWT."""
        response_body = {"message": "Invalid token"}
        return Response(
            json.dumps(response_body),
            status=401,
            content_type="application/json",
        )

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        """Obsługa unieważnionego tokenu JWT."""
        response_body = {"message": "Token has been revoked"}
        return Response(
            json.dumps(response_body),
            status=401,
            content_type="application/json",
        )

    from app.routes.reservation_routes import reservation_bp

    app.register_blueprint(reservation_bp, url_prefix="/api/reservations")

    return app
