from datetime import datetime, timezone

from sqlalchemy import asc, desc

from app import db
from app.models.reservation import Reservation


class ReservationRepository:

    @staticmethod
    def get_filtered(
        is_active=None, sort_by=None, sort_order="asc", user_id=None, room_id=None, date_start=None, date_end=None
    ):
        query = db.session.query(Reservation)

        if is_active is not None:
            if is_active:
                query = query.filter(Reservation.cancel_date.is_(None))
            else:
                query = query.filter(Reservation.cancel_date.is_not(None))

        if user_id is not None:
            query = query.filter(Reservation.user_id == user_id)

        if room_id is not None:
            query = query.filter(Reservation.room_id == room_id)

        if date_start:
            query = query.filter(Reservation.start_date >= date_start)
        if date_end:
            query = query.filter(Reservation.end_date <= date_end)

        if sort_by:
            sort_column = getattr(Reservation, sort_by, None)
            if sort_column:
                if sort_order == "desc":
                    query = query.order_by(desc(sort_column))
                else:
                    query = query.order_by(asc(sort_column))

        return query.all()


    @staticmethod
    def check_room_availability(room_id, start_date, end_date):
        overlapping_reservations = (
            db.session.query(Reservation)
            .filter(
                Reservation.room_id == room_id,
                (Reservation.start_date < end_date) & (Reservation.end_date > start_date),
            )
            .all()
        )

        if overlapping_reservations:
            return {
                "available": False,
                "conflicts": [
                    {
                        "id": reservation.id,
                        "start_date": reservation.start_date,
                        "end_date": reservation.end_date,
                    }
                    for reservation in overlapping_reservations
                ],
            }

        return {"available": True, "conflicts": []}


    @staticmethod
    def create(data):
        room_id = data.get("room_id")
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if isinstance(start_date, str):
            start_date = datetime.strptime(start_date, "%Y-%m-%dT%H:%M:%S")
        if isinstance(end_date, str):
            end_date = datetime.strptime(end_date, "%Y-%m-%dT%H:%M:%S")

        if not ReservationRepository.check_room_availability(
            room_id, start_date, end_date
        ):
            raise ValueError(
                f"Room {room_id} is already reserved in the specified date range."
            )

        reservation = Reservation(**data)
        db.session.add(reservation)
        db.session.commit()
        return reservation

    @staticmethod
    def update(id, data):
        reservation = Reservation.query.get(id)
        if reservation:
            for key, value in data.items():
                setattr(reservation, key, value)
            db.session.commit()
        return reservation

    @staticmethod
    def cancel(id):
        reservation = Reservation.query.get(id)
        if reservation:
            reservation.cancel_date = datetime.now(timezone.utc)
            db.session.commit()
        return reservation

    @staticmethod
    def get_all():
        return Reservation.query.all()

    @staticmethod
    def get_by_id(id):
        return Reservation.query.get(id)

    @staticmethod
    def get_by_room(room_id):
        return Reservation.query.filter_by(room_id=room_id).all()

    @staticmethod
    def get_by_room_and_date_range(room_id, start_date, end_date):
        return Reservation.query.filter(
            Reservation.room_id == room_id,
            Reservation.start_date < end_date,
            Reservation.end_date > start_date,
        ).all()

    @staticmethod
    def get_by_date_range(
        start_date: datetime,
        end_date: datetime,
        sort_by="start_date",
        descending=False,
    ):
        if sort_by == "end_date":
            sort_field = Reservation.end_date
        else:
            sort_field = Reservation.start_date

        if descending:
            sort_field = desc(sort_field)

        return (
            db.session.query(Reservation)
            .filter(
                (Reservation.start_date <= end_date)
                & (Reservation.end_date >= start_date)
            )
            .order_by(sort_field)
            .all()
        )
