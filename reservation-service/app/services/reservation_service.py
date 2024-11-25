from marshmallow import ValidationError

from app.repositories.reservation_repository import ReservationRepository
from app.schemas.reservation_schema import ReservationSchema


class ReservationService:

    @staticmethod
    def create_reservation(data):
        """Create a new reservation."""
        schema = ReservationSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as err:
            return {"errors": err.messages}, 400

        reservation = ReservationRepository.create(validated_data)
        return schema.dump(reservation), 201

    @staticmethod
    def update_reservation(id, data):
        """Update an existing reservation."""
        reservation = ReservationRepository.update(id, data)
        if not reservation:
            return {"message": "Reservation not found"}, 404
        schema = ReservationSchema()
        return schema.dump(reservation), 200

    @staticmethod
    def cancel_reservation(id):
        """Cancel a reservation."""
        reservation = ReservationRepository.cancel(id)
        if not reservation:
            return {"message": "Reservation not found"}, 404
        schema = ReservationSchema()
        return schema.dump(reservation), 200
