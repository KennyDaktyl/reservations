from marshmallow import ValidationError, fields, validates_schema
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from app.models import Equipment


class EquipmentSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Equipment
        load_instance = False

    name = fields.String(
        required=True,
        error_messages={"required": "The 'name' field is required."},
    )

    @validates_schema
    def validate_equipment(self, data, **kwargs):
        if not data.get("name"):
            raise ValidationError({"name": "The 'name' field is required."})
