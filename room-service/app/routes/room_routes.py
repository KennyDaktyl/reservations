from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from flask_restx import Api, Resource, fields
from marshmallow import ValidationError

from app.repositories.room_repository import RoomRepository
from app.schemas.room_schemas import RoomRequestSchema, RoomSchema
from app.utils.admin_required_decorator import admin_required

room_bp = Blueprint("rooms", __name__)
api = Api(
    room_bp,
    doc="/docs",
    title="Rooms API",
    description="API for managing rooms",
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

room_model = api.model(
    "Room",
    {
        "name": fields.String(required=True, description="Name of the room"),
        "capacity": fields.Integer(required=True, description="Room capacity"),
        "equipments": fields.List(fields.Integer, description="List of equipment IDs"),
    },
)


@api.route("/create_room", methods=["POST"])
class RoomCreate(Resource):
    
    @admin_required
    @api.expect(room_model)
    def post(self):
        """Create a new room"""
        schema = RoomRequestSchema()
        try:
            data = schema.load(request.json)
        except ValidationError as err:
            return {"errors": err.messages}, 400

        room = RoomRepository.create(data)
        room_schema = RoomSchema()
        return room_schema.dump(room), 201


@api.route("/list_rooms", methods=["GET"])
class RoomList(Resource):
    
    def get(self):
        """Get all rooms"""
        rooms = RoomRepository.get_all()
        schema = RoomSchema(many=True)
        return schema.dump(rooms), 200


@api.route("/<int:id>", methods=["GET", "PUT", "DELETE"])
class RoomDetail(Resource):
    def get(self, id):
        """Get a room by id"""
        room = RoomRepository.get_by_id(id)
        schema = RoomSchema()
        return schema.dump(room), 200

    @admin_required
    @api.expect(room_model)
    def put(self, id):
        """Update a room"""
        schema = RoomRequestSchema(partial=True)
        try:
            data = schema.load(request.json)
        except ValidationError as err:
            return {"errors": err.messages}, 400

        try:
            room = RoomRepository.update(id, data)
        except ValueError as err:
            return {"message": str(err)}, 404

        return schema.dump(room), 200

    @admin_required
    def delete(self, id):
        """Delete a room"""
        RoomRepository.delete(id)
        return {"message": "Room deleted"}, 204
