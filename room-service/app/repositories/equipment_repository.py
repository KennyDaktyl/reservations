from app import db
from app.models import Equipment


class EquipmentRepository:
    @staticmethod
    def get_all():
        """Retrieve all equipment"""
        return Equipment.query.order_by(Equipment.name.asc()).all()

    @staticmethod
    def get_by_id(id):
        """Retrieve a single equipment by ID"""
        equipment = Equipment.query.get_or_404(id)
        return equipment

    @staticmethod
    def create(data):
        """Create new equipment"""
        equipment = Equipment(**data)
        db.session.add(equipment)
        db.session.commit()
        return equipment

    @staticmethod
    def update(id, data):
        """Update existing equipment by ID"""
        equipment = Equipment.query.get(id)
        if not equipment:
            raise ValueError(f"Equipment with id {id} does not exist.")

        for key, value in data.items():
            if value is not None:
                setattr(equipment, key, value)

        db.session.commit()
        return equipment

    @staticmethod
    def delete(id):
        """Delete equipment by ID"""
        equipment = Equipment.query.get_or_404(id)
        db.session.delete(equipment)
        db.session.commit()
