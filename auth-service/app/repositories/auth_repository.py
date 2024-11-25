from datetime import timedelta
from flask_jwt_extended import create_access_token
from app.models.user import User


class AuthRepository:
    @staticmethod
    def authenticate_user(email, password):
        """Authenticate a user by email and password."""
        user = User.query.filter_by(email=email).first()
        if user is None or not user.check_password(password):
            return None

        access_token = create_access_token(
            identity=str(user.id),  
            additional_claims={"role": user.role},
            expires_delta=timedelta(hours=1)
        )
        return user, access_token
