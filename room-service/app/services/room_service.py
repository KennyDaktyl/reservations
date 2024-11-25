# app/services/room_service.py
from app import db
from app.models import Room


def create_room(name, capacity):
    new_room = Room(name=name, capacity=capacity)
    db.session.add(new_room)
    db.session.commit()
    return new_room
