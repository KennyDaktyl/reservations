from app import db
from app.models import Equipment, Room


class RoomEquipmentsRepository:
    @staticmethod
    def add_equipment_to_room(room_id, equipment_id):
        """Assign equipment to a room"""
        room = db.session.query(Room).filter_by(id=room_id).first()
        equipment = (
            db.session.query(Equipment).filter_by(id=equipment_id).first()
        )

        if not room or not equipment:
            raise ValueError(  # noqa
                f"Room or equipment not found: room_id={room_id}, equipment_id={equipment_id}"
            )  # noqa

        if equipment in room.equipments:
            raise ValueError(  # noqa
                f"Equipment with id {equipment_id} is already assigned to room {room_id}."
            )  # noqa

        room.equipments.append(equipment)
        db.session.commit()
        return room

    @staticmethod
    def remove_equipment_from_room(room_id, equipment_id):
        """Remove equipment from a room"""
        room = db.session.query(Room).filter_by(id=room_id).first()
        equipment = (
            db.session.query(Equipment).filter_by(id=equipment_id).first()
        )

        if not room or not equipment:
            raise ValueError(
                f"Room or equipment not found: room_id={room_id}, equipment_id={equipment_id}"  # noqa
            )

        if equipment not in room.equipments:
            raise ValueError(
                f"Equipment with id {equipment_id} is not assigned to room {room_id}."  # noqa
            )

        room.equipments.remove(equipment)
        db.session.commit()
        return room
