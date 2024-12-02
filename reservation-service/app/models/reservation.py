from datetime import datetime, timezone

from sqlalchemy import Index
from sqlalchemy.dialects.postgresql import JSON

from app import db


class Reservation(db.Model):
    __tablename__ = "reservations"

    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, nullable=False, index=True)
    user_id = db.Column(db.Integer, nullable=False, index=True)
    start_date = db.Column(db.DateTime, nullable=False, index=True)
    end_date = db.Column(db.DateTime, nullable=False, index=True)
    cancel_date = db.Column(db.DateTime, nullable=True, index=True)

    room_data = db.Column(JSON, nullable=True)
    user_data = db.Column(JSON, nullable=True)

    created_date = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_date = db.Column(
        db.DateTime,
        default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc),
    )

    __table_args__ = (
        Index("ix_room_date_range", "room_id", "start_date", "end_date"),
        Index("ix_user_date_range", "user_id", "start_date", "end_date"),
    )

    def overlaps(self, start_date, end_date):
        return self.start_date < end_date and self.end_date > start_date

    def is_active(self):
        return not self.cancel_date
