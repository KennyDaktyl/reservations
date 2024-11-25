from marshmallow import ValidationError, fields, validate, validates_schema
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from app.models import Room
from app.schemas.equipment_schemas import EquipmentSchema


class RoomSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Room
        load_instance = False

    name = fields.String(
        required=True,
        validate=validate.Length(min=1, max=255),
        error_messages={
            "required": "The 'name' field is required.",
            "null": "The 'name' field cannot be null.",
        },
    )
    capacity = fields.Integer(
        required=True,
        validate=validate.Range(
            min=0, error="The 'capacity' field must be 0 or greater."
        ),
        error_messages={
            "required": "The 'capacity' field is required.",
            "null": "The 'capacity' field cannot be null.",
        },
    )
    equipments = fields.List(fields.Nested(EquipmentSchema), missing=[])

    @validates_schema
    def validate_room(self, data, **kwargs):
        if not data.get("name"):
            raise ValidationError({"name": "The 'name' field is required."})
