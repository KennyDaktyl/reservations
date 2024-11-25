from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from flask_restx import Api, Resource, fields
from marshmallow import ValidationError

from app.repositories.equipment_repository import EquipmentRepository
from app.schemas.room_schemas import EquipmentSchema

equipment_bp = Blueprint("equipments", __name__)
api = Api(
    equipment_bp,
    doc="/docs",
    title="Equipment API",
    description="API for managing equipment",
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

equipment_model = api.model(
    "Equipment",
    {
        "name": fields.String(
            required=True, description="Name of the equipment"
        ),
    },
)


@api.route("/list_equipments", methods=["GET"])
class EquipmentList(Resource):

    def get(self):
        """Get all equipment"""
        equipments = EquipmentRepository.get_all()
        schema = EquipmentSchema(many=True)
        return schema.dump(equipments), 200


@api.route("/create_equipment", methods=["POST"])
class EquipmentCreate(Resource):

    @jwt_required()
    @api.expect(equipment_model)
    def post(self):
        """Add new equipment"""
        schema = EquipmentSchema()
        try:
            data = schema.load(request.json)
        except ValidationError as err:
            return {"errors": err.messages}, 400

        equipment = EquipmentRepository.create(data)
        return schema.dump(equipment), 201


@api.route("/<int:id>", methods=["GET", "PUT", "DELETE"])
class EquipmentDetail(Resource):
    
    def get(self, id):
        """Get a single equipment by ID"""
        equipment = EquipmentRepository.get_by_id(id)
        schema = EquipmentSchema()
        return schema.dump(equipment), 200

    @jwt_required()
    @api.expect(equipment_model)
    def put(self, id):
        """Update an existing equipment"""
        schema = EquipmentSchema(partial=True)
        try:
            data = schema.load(request.json)
        except ValidationError as err:
            return {"errors": err.messages}, 400

        try:
            equipment = EquipmentRepository.update(id, data)
        except ValueError as err:
            return {"message": str(err)}, 404

        return schema.dump(equipment), 200

    @jwt_required()
    def delete(self, id):
        """Delete an equipment"""
        try:
            EquipmentRepository.delete(id)
        except ValueError as err:
            return {"message": str(err)}, 404
        return {"message": "Equipment deleted"}, 204
