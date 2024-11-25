from marshmallow import ValidationError

from app import db
from app.models import Room
from app.schemas.room_schemas import RoomSchema


class RoomRepository:
    @staticmethod
    def get_all():
        return Room.query.all()

    @staticmethod
    def get_by_id(id):
        return Room.query.get_or_404(id)

    @staticmethod
    def create(data):
        """Create a new room from validated data"""
        schema = RoomSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as err:
            raise ValueError(err.messages)

        room = Room(**validated_data)
        db.session.add(room)
        db.session.commit()
        return room

    @staticmethod
    def update(id, data):
        """Update a room by ID"""
        schema = RoomSchema(partial=True)
        room = Room.query.get(id)
        if not room:
            raise ValueError(f"Room with id {id} does not exist.")

        try:
            validated_data = schema.load(data)
        except ValidationError as err:
            raise ValueError(err.messages)

        for key, value in validated_data.items():
            setattr(room, key, value)

        db.session.commit()
        return room

    @staticmethod
    def delete(id):
        room = Room.query.get_or_404(id)
        db.session.delete(room)
        db.session.commit()
