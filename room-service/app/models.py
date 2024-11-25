from app import db

room_equipment = db.Table(
    "room_equipment",
    db.Column(
        "room_id", db.Integer, db.ForeignKey("room.id"), primary_key=True
    ),
    db.Column(
        "equipment_id",
        db.Integer,
        db.ForeignKey("equipment.id"),
        primary_key=True,
    ),
)


class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), nullable=False)
    capacity = db.Column(db.Integer, nullable=False, index=True)
    equipments = db.relationship(
        "Equipment",
        secondary=room_equipment,
        backref=db.backref("rooms", lazy="dynamic"),
    )

    def __repr__(self):
        return f"<Room {self.name}>"


class Equipment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), nullable=False)

    def __repr__(self):
        return f"<Equipment {self.name}>"
