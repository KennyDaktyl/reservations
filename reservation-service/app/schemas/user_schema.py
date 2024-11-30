from marshmallow import Schema, fields, validate


class UserSchema(Schema):
    id = fields.Integer(required=True)
    email = fields.Email(required=True, validate=validate.Length(min=5, max=120))
    role = fields.String(required=True, validate=validate.OneOf(["admin", "user"]))
