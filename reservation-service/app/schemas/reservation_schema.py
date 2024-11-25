from marshmallow import Schema, ValidationError, fields, validates_schema

from app.repositories.reservation_repository import ReservationRepository
from app.schemas.room_schema import RoomSchema
from app.schemas.user_schema import UserSchema


class ReservationSchema(Schema):
    id = fields.Integer(dump_only=True)
    room_id = fields.Integer(required=True)
    user_id = fields.Integer(required=True)

    start_date = fields.DateTime(required=True)
    end_date = fields.DateTime(required=True)

    room_data = fields.Nested(RoomSchema)
    user_data = fields.Nested(UserSchema)

    @validates_schema
    def validate_dates(self, data, **kwargs):
        """Validate that the reservation dates are valid and available."""
        start_date = data.get("start_date")
        end_date = data.get("end_date")
        room_id = data.get("room_id")

        if start_date >= end_date:
            raise ValidationError({"start_date": "Start date must be before end date."})

        reservations = ReservationRepository.get_by_room(room_id)
        for reservation in reservations:
            if reservation.overlaps(start_date, end_date):
                raise ValidationError(
                    {
                        "room_id": f"Room {room_id} is not available from {start_date} to {end_date}."
                    }
                )


class ReservationRespnoseSchema(ReservationSchema):

    created_date = fields.DateTime(dump_only=True)
    updated_date = fields.DateTime(dump_only=True)
    cancel_date = fields.DateTime(dump_only=True)
    is_active = fields.Method("get_is_active", dump_only=True)

    def get_is_active(self, obj):
        return obj.cancel_date is None


class ReservationDateRangeSchema(Schema):
    start_date = fields.DateTime(format="%Y-%m-%d %H:%M:%S", required=True)
    end_date = fields.DateTime(format="%Y-%m-%d %H:%M:%S", required=True)
