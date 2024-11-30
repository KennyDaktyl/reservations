from app import db
from app.models.user import User


class UserRepository:
    @staticmethod
    def get_by_email(email):
        """Retrieve a user by email."""
        return User.query.filter_by(email=email).first()
    
    @staticmethod
    def get_by_id(id):
        """Retrieve a user by email."""
        return User.query.filter_by(id=id).first()

    @staticmethod
    def create_user(email, password, role):
        """Create a new user."""
        new_user = User(email=email, role=role)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        return new_user
