# app/config.py
import os

from dotenv import load_dotenv  # type: ignore


class Config:
    """Base configuration class."""

    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")
    JWT_TOKEN_LOCATION = ["headers"]


class DevelopmentConfig(Config):
    """Development configuration."""

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres_user:postgres_pass@postgres-service:5433/room_db",
    )  # noqa


class TestingConfig(Config):
    """Testing configuration."""

    SQLALCHEMY_DATABASE_URI = "sqlite:///test.db"
