import os
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from .config import DevelopmentConfig, TestingConfig

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
ma = Marshmallow()


def create_app(config_type=None):
    app = Flask(__name__)

    if config_type is None:
        config_type = os.getenv('FLASK_ENV', 'development')
        
    if config_type == "testing":
        app.config.from_object(TestingConfig)
    else:
        app.config.from_object(DevelopmentConfig)

    db.init_app(app)
    migrate.init_app(app, db)
    
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "jwtsecret")
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    jwt.init_app(app)
    ma.init_app(app)

    from app.routes.auth import auth_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    return app
