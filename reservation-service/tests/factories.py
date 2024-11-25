from datetime import datetime, timedelta, timezone

import factory

from app import db
from app.models.reservation import Reservation


class ReservationFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = Reservation
        sqlalchemy_session = db.session

    id = factory.Sequence(lambda n: n + 1)
    room_id = factory.Sequence(lambda n: n + 1)
    user_id = factory.Sequence(lambda n: n + 1)
    start_date = factory.LazyFunction(
        lambda: datetime.now(timezone.utc) + timedelta(days=1)
    )
    end_date = factory.LazyFunction(
        lambda: datetime.now(timezone.utc) + timedelta(days=2)
    )
    room_data = factory.LazyAttribute(
        lambda o: {"id": o.room_id, "name": f"SALA {o.room_id}"}
    )
    user_data = factory.LazyAttribute(
        lambda o: {
            "id": o.user_id,
            "name": f"user{o.user_id}@example.com",
            "role": "user",
        }
    )
