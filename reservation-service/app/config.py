# app/config.py
import os

from dotenv import load_dotenv  # type: ignore

load_dotenv()


class Config:
    """Base config class"""

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")
    JWT_TOKEN_LOCATION = ["headers"]


class DevelopmentConfig(Config):
    """Development configuration"""

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres_user:postgres_pass@postgres-service:5433/reservation_db",
    )


class TestingConfig(Config):
    """Testing configuration with SQLite"""

    SQLALCHEMY_DATABASE_URI = "sqlite:///test.db"
    TESTING = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class ProductionConfig(Config):
    """Production configuration"""

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres_user:postgres_pass@postgres-service:5433/prod_reservation_db",
    )
