from marshmallow import Schema, ValidationError, fields, validate


class UserSchema(Schema):
    email = fields.Email(
        required=True, validate=validate.Length(min=5, max=120)
    )
    password = fields.String(required=True, validate=validate.Length(min=6))
    role = fields.String(
        validate=validate.OneOf(["user", "admin"]), default="user"
    )

    def handle_error(self, exc, data, **kwargs):
        if isinstance(exc, ValidationError):
            error_messages = exc.messages
            error_response = {"errors": error_messages}
            return error_response, 400 
        return super().handle_error(exc, data, **kwargs)


class UserResponseSchema(Schema):
    id = fields.Int()
    email = fields.Str()
    role = fields.Str()
