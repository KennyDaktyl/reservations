from marshmallow import ValidationError

from app import db
from app.models import Equipment, Room
from app.schemas.room_schemas import RoomRequestSchema, RoomSchema


class RoomRepository:
    @staticmethod
    def get_all():
        return Room.query.all()
    
    @staticmethod
    def get_filtered(min_capacity=None, max_capacity=None, equipment_ids=None):
        query = Room.query

        if min_capacity is not None:
            query = query.filter(Room.capacity >= min_capacity)
        if max_capacity is not None:
            query = query.filter(Room.capacity <= max_capacity)

        if equipment_ids:
            query = query.filter(Room.equipments.any(Equipment.id.in_(equipment_ids)))

        query = query.order_by(Room.name.asc())

        return query.all()

    @staticmethod
    def get_by_id(id):
        return Room.query.get_or_404(id)

    @staticmethod
    def create(data):
        """Create a new room with associated equipment"""
        schema = RoomRequestSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as err:
            raise ValueError(err.messages)

        equipment_ids = validated_data.pop("equipments", [])
        equipments = Equipment.query.filter(Equipment.id.in_(equipment_ids)).all()

        if len(equipments) != len(equipment_ids):
            missing_ids = set(equipment_ids) - {e.id for e in equipments}
            raise ValueError({"equipments": f"Invalid equipment IDs: {list(missing_ids)}"})

        room = Room(**validated_data)
        room.equipments.extend(equipments)

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
