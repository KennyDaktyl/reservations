from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from flask_restx import Api, Namespace, Resource, fields
from marshmallow import ValidationError

from app.repositories.room_equipments_repository import (
    RoomEquipmentsRepository,
)
from app.schemas.room_equipments_schema import RoomEquipmentSchema
from app.schemas.room_schemas import RoomSchema
from app.utils.admin_required_decorator import admin_required

room_equipments_bp = Blueprint("room_equipments", __name__)
api = Api(
    room_equipments_bp,
    doc="/docs",
    title="Equipment API",
    description="API for managing room equipments",
    authorizations={
        "Bearer": {
            "type": "apiKey",
            "in": "header",
            "name": "Authorization",
            "description": "Provide the token as `Bearer <your-token>`"
        }
    },
    security=[{"Bearer": []}] 
)

equipments_room_ns = Namespace("", description="Equipment to room operations")
api.add_namespace(equipments_room_ns)

add_equipment_to_room = api.model(
    "EquipmentInRoom",
    {
        "equipment_id": fields.Integer(
            required=True, description="ID of the equipment"
        ),
        "room_id": fields.Integer(required=True, description="ID of the room"),
    },
)


@equipments_room_ns.route("/add_room_equipment", methods=["POST"])
class AddEquipmentToRoom(Resource):
    
    @admin_required
    @equipments_room_ns.expect(add_equipment_to_room)
    @equipments_room_ns.doc("add_equipment_to_room")
    def post(self):
        """Assign equipment to a room"""
        schema = RoomEquipmentSchema()
        try:
            data = schema.load(request.json, action="add")
        except ValidationError as err:
            return {"errors": err.messages}, 400

        room = RoomEquipmentsRepository.add_equipment_to_room(
            data["room_id"], data["equipment_id"]
        )
        room_schema = RoomSchema()
        return room_schema.dump(room), 201


@equipments_room_ns.route("/remove_room_equipment", methods=["DELETE"])
class RemoveEquipmentFromRoom(Resource):
    
    @admin_required
    @equipments_room_ns.expect(add_equipment_to_room)
    @equipments_room_ns.doc("remove_equipment_to_room")
    def delete(self):
        """Remove equipment from a room"""
        schema = RoomEquipmentSchema()
        try:
            data = schema.load(request.json, action="delete")
        except ValidationError as err:
            return {"errors": err.messages}, 400

        room = RoomEquipmentsRepository.remove_equipment_from_room(
            data["room_id"], data["equipment_id"]
        )
        room_schema = RoomSchema()
        return room_schema.dump(room), 204
