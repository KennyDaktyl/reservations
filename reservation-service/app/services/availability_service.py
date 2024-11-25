from app.repositories.reservation_repository import ReservationRepository


class AvailabilityService:

    @staticmethod
    def check_availability(room_id, start_date, end_date):
        """
        Check if a room is available for a given date range.
        Returns True if the room is available, otherwise False.
        """
        if start_date >= end_date:
            raise ValueError("Start date must be before the end date.")

        reservations = ReservationRepository.get_by_room_and_date_range(
            room_id, start_date, end_date
        )

        return not any(
            reservation.overlaps(start_date, end_date) for reservation in reservations
        )
