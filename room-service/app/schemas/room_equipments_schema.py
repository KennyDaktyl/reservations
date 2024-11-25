from marshmallow import Schema, ValidationError, fields

from app import db
from app.models import Equipment, Room


class RoomEquipmentSchema(Schema):
    room_id = fields.Integer(
        required=True,
        error_messages={
            "required": "The 'room_id' field is required.",
            "null": "The 'room_id' field cannot be null.",
        },
    )
    equipment_id = fields.Integer(
        required=True,
        error_messages={
            "required": "The 'equipment_id' field is required.",
            "null": "The 'equipment_id' field cannot be null.",
        },
    )

    def validate_room_and_equipment(self, data, action="add"):
        """Validate if the room and equipment exist"""
        room = db.session.query(Room).filter_by(id=data.get("room_id")).first()
        if not room:
            raise ValidationError(
                {
                    "room_id": f"Room with id {data.get('room_id')} does not exist."
                }
            )  # noqa: E501

        equipment = db.session.query(Equipment).filter_by(id=data.get("equipment_id")).first()
        if not equipment:
            raise ValidationError(
                {
                    "equipment_id": f"Equipment with id {data.get('equipment_id')} does not exist."
                }
            )  # noqa: E501

        if action == "add" and equipment in room.equipments:
            raise ValidationError(
                {
                    "equipment_id": f"Equipment with id {data.get('equipment_id')} is already assigned "
                                    f"to room {data.get('room_id')}."
                }
            )  # noqa: E501

        if action == "delete" and equipment not in room.equipments:
            raise ValidationError(
                {
                    "equipment_id": f"Equipment with id {data.get('equipment_id')} is not assigned "
                                    f"to room {data.get('room_id')}."
                }
            )  # noqa: E501

        return data

    def load(self, data, action="add", *args, **kwargs):
        """Override load to include validation logic"""
        data = super().load(data, *args, **kwargs)
        return self.validate_room_and_equipment(data, action=action)
