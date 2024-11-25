from marshmallow import Schema, fields, validate


class EquipmentSchema(Schema):
    id = fields.Integer(required=True)
    name = fields.String(required=True, validate=validate.Length(min=1, max=255))


class RoomSchema(Schema):
    id = fields.Integer(required=True)
    name = fields.String(required=True, validate=validate.Length(min=1, max=255))
    capacity = fields.Integer(required=True, validate=validate.Range(min=0))
    equipments = fields.Nested(EquipmentSchema, many=True)
