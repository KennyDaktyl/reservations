from marshmallow import Schema, fields, validate


class UserSchema(Schema):
    id = fields.Integer(required=True)
    name = fields.String(required=True, validate=validate.Length(min=1, max=255))
    role = fields.String(required=True, validate=validate.OneOf(["admin", "user"]))
