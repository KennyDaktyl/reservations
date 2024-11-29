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
    equipments = fields.List(
        fields.Nested(EquipmentSchema), missing=[]
    )  

    @validates_schema
    def validate_room(self, data, **kwargs):
        if not data.get("name"):
            raise ValidationError({"name": "The 'name' field is required."})


class RoomRequestSchema(SQLAlchemyAutoSchema):
    """
    Schema for validating room creation requests.
    """
    class Meta:
        model = Room
        load_instance = False
        exclude = ("id",)
        load_only = ("equipments",)
        dump_only = ("id",)

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
    equipments = fields.List(
        fields.Integer(),  
        missing=[],
        validate=validate.Length(min=0),
        error_messages={
            "invalid": "Equipments must be a list of integers.",
        },
    )

    @validates_schema
    def validate_room_request(self, data, **kwargs):
        if not data.get("name"):
            raise ValidationError({"name": "The 'name' field is required."})

        equipments = data.get("equipments", [])
        if not isinstance(equipments, list):
            raise ValidationError({"equipments": "Must be a list of integers."})

        if equipments and not all(isinstance(e, int) for e in equipments):
            raise ValidationError({"equipments": "All items in the list must be integers."})
