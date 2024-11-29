import os
import logging

from flask import Flask, Response, json, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, verify_jwt_in_request
from flask_jwt_extended.exceptions import NoAuthorizationError
from werkzeug.exceptions import HTTPException
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from app.config import DevelopmentConfig

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
ma = Marshmallow()


def create_app(config_type="development"):
    app = Flask(__name__)

    if config_type == "development":
        app.config.from_object(DevelopmentConfig)

    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "default_secret_key")
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)
    
    CORS(app)

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
            or request.path.startswith("/api/rooms/docs")
            or request.path.startswith("/api/equipments/docs")
            or request.path.startswith("/api/room_equipments/docs")
            or request.path.startswith("/api/rooms/swagger.json")
            or request.path.startswith("/api/equipments/swagger.json")
            or request.path.startswith("/api/room_equipments/swagger.json")
        ):
            return

        try:
            verify_jwt_in_request()
        except NoAuthorizationError:
            return Response(
                json.dumps({"message": "Missing Authorization Header"}),
                status=401,
                content_type="application/json",
            )
        except Exception as e:
            return Response(
                json.dumps({"message": str(e)}),
                status=401,
                content_type="application/json",
            )


    @app.errorhandler(NoAuthorizationError)
    def handle_no_authorization_error(e):
        response_body = {"message": "Missing Authorization Header"}
        return Response(
            json.dumps(response_body),
            status=401,
            content_type="application/json",
        )

    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        response_body = {"message": e.description}
        return Response(
            json.dumps(response_body),
            status=e.code,
            content_type="application/json",
        )

    @app.errorhandler(Exception)
    def handle_generic_exception(e):
        logging.exception("Unhandled exception: %s", e)
        response_body = {"message": "Internal server error"}
        return Response(
            json.dumps(response_body),
            status=500,
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
        
    from app.routes.equipment_routes import equipment_bp
    from app.routes.room_equipments_routes import room_equipments_bp
    from app.routes.room_routes import room_bp

    app.register_blueprint(room_bp, url_prefix="/api/rooms")
    app.register_blueprint(equipment_bp, url_prefix="/api/equipments")
    app.register_blueprint(
        room_equipments_bp, url_prefix="/api/room_equipments"
    )

    return app
