from datetime import datetime

from app import db
from app.repositories.reservation_repository import ReservationRepository
from tests.factories import ReservationFactory


def test_check_room_availability(app):
    with app.app_context():
        reservation = ReservationFactory()

        db.session.add(reservation)
        db.session.commit()

        is_available = ReservationRepository.check_room_availability(
            room_id=reservation.room_id,
            start_date=reservation.start_date,
            end_date=reservation.end_date,
        )

        assert not is_available


def test_create_reservation(app):
    with app.app_context():
        reservation_data = ReservationFactory.create()

        start_date = datetime.strptime(
            reservation_data.start_date.isoformat(), "%Y-%m-%dT%H:%M:%S.%f%z"
        )
        end_date = datetime.strptime(
            reservation_data.end_date.isoformat(), "%Y-%m-%dT%H:%M:%S.%f%z"
        )

        reservation_data_dict = {
            "room_id": reservation_data.room_id,
            "user_id": reservation_data.user_id,
            "start_date": start_date,
            "end_date": end_date,
            "room_data": reservation_data.room_data,
            "user_data": reservation_data.user_data,
        }

        is_available = ReservationRepository.check_room_availability(
            reservation_data.room_id,
            reservation_data.start_date,
            reservation_data.end_date,
        )

        if is_available:
            reservation = ReservationRepository.create(reservation_data_dict)
            assert reservation.id is not None
            assert reservation.room_id == reservation_data_dict["room_id"]
            assert reservation.user_id == reservation_data_dict["user_id"]
            assert (
                reservation.start_date.isoformat()
                == reservation_data_dict["start_date"].isoformat()
            )
            assert (
                reservation.end_date.isoformat()
                == reservation_data_dict["end_date"].isoformat()
            )
