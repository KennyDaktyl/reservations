from datetime import datetime

from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from flask_restx import Api, Namespace, Resource, fields
from marshmallow import ValidationError

from app.repositories.reservation_repository import ReservationRepository
from app.schemas.reservation_schema import (ReservationRespnoseSchema,
                                            ReservationSchema)
from app.utils.admin_required_decorator import admin_required
from app.sockets import notify_reservation_update


reservation_bp = Blueprint("reservations", __name__)
api = Api(
    reservation_bp,
    doc="/docs",
    title="Reservations API",
    description="API for managing reservations",
    authorizations={
        "Bearer": {
            "type": "apiKey",
            "in": "header",
            "name": "Authorization",
            "description": "Provide the token as `Bearer <your-token>`",
        }
    },
    security=[{"Bearer": []}],
)

reservation_ns = Namespace("", description="Manage reservations")
api.add_namespace(reservation_ns)

reservation_model = api.model(
    "Reservation",
    {
        "room_id": fields.Integer(required=True, description="ID of the room"),
        "user_id": fields.Integer(required=True, description="ID of the user"),
        "start_date": fields.String(
            required=True, description="Start date of the reservation"
        ),
        "end_date": fields.String(
            required=True, description="End date of the reservation"
        ),
        "room_data": fields.Raw(description="Additional room details", required=False),
        "user_data": fields.Raw(description="Additional user details", required=False),
    },
)


@reservation_ns.route("/list_reservations", methods=["GET"])
class ReservationList(Resource):
    @admin_required
    @reservation_ns.doc("list_reservations")
    def get(self):
        is_active = request.args.get("is_active")
        sort_by = request.args.get("sort_by")
        sort_order = request.args.get("sort_order", "asc")
        user_id = request.args.get("user_id", type=int)
        room_id = request.args.get("room_id", type=int)

        if is_active is not None:
            is_active = is_active.lower() == "true"

        reservations = ReservationRepository.get_filtered(
            is_active=is_active,
            sort_by=sort_by,
            sort_order=sort_order,
            user_id=user_id,
            room_id=room_id,
        )

        schema = ReservationRespnoseSchema(many=True)
        return schema.dump(reservations), 200


@reservation_ns.route("/create_reservation", methods=["POST"])
class ReservationCreate(Resource):

    @reservation_ns.doc("create_reservation")
    @reservation_ns.expect(reservation_model)
    @jwt_required()
    def post(self):
        try:
            validated_data = self._validate_reservation_data(request.json)
            self._validate_dates(validated_data)

            if not self._is_room_available(validated_data):
                return self._room_unavailable_response(validated_data)

            reservation = self._create_reservation(validated_data)
            self._send_reservation_notification(reservation)
            return self._serialize_reservation(reservation), 201

        except ValidationError as err:
            return {"errors": err.messages}, 400
        except ValueError as err:
            return {"message": str(err)}, 400
        except Exception as e:
            return {"message": f"Error creating reservation: {str(e)}"}, 500

    def _validate_reservation_data(self, data):
        schema = ReservationSchema()
        return schema.load(data)

    def _validate_dates(self, data):
        start_date = data["start_date"]
        end_date = data["end_date"]

        self._parse_date(start_date, "start_date")
        self._parse_date(end_date, "end_date")

    def _parse_date(self, date_str, field_name):
        if isinstance(date_str, str):
            try:
                return datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S")
            except ValueError:
                raise ValueError(f"Invalid {field_name} format. Use YYYY-MM-DDTHH:MM:SS")

    def _is_room_available(self, data):
        room_id = data["room_id"]
        start_date = data["start_date"]
        end_date = data["end_date"]
        return ReservationRepository.check_room_availability(room_id, start_date, end_date)

    def _room_unavailable_response(self, data):
        room_id = data["room_id"]
        return {"message": f"Room {room_id} is already reserved in the specified date range."}, 400

    def _create_reservation(self, data):
        return ReservationRepository.create(data)

    def _send_reservation_notification(self, reservation):
        notify_reservation_update(
            "created",
            {
                "id": reservation.id,
                "room_id": reservation.room_id,
                "user_id": reservation.user_id,
                "user_data": reservation.user_data,
                "room_data": reservation.room_data,
            }
        )

    def _serialize_reservation(self, reservation):
        schema = ReservationSchema()
        return schema.dump(reservation)


@reservation_ns.route("/<int:id>", methods=["GET"])
class ReservationDetail(Resource):

    @admin_required
    @reservation_ns.doc("get_reservation")
    def get(self, id):
        reservation = ReservationRepository.get_by_id(id)
        if not reservation:
            return {"message": "Reservation not found"}, 404

        schema = ReservationSchema()
        return schema.dump(reservation), 200

    @jwt_required()
    @admin_required
    @reservation_ns.doc("delete_reservation")
    def delete(self, id):
        if not ReservationRepository.cancel(id):
            return {"message": "Reservation not found"}, 404
        
        reservation = ReservationRepository.get_by_id(id)
        notify_reservation_update("cancel", {"id": reservation.id, "room_id": reservation.room_id, "user_id": reservation.user_id, "user_data": reservation.user_data, "room_data": reservation.room_data, "room_data": reservation.room_data})
        return {"message": "Reservation deleted"}, 200


reservation_date_range_model = api.model(
    "ReservationDateRangeModel",
    {
        "start_date": fields.String(
            required=True,
            description="Start date of the range in format 'YYYY-MM-DD HH:MM:SS'",
        ),
        "end_date": fields.String(
            required=True,
            description="End date of the range in format 'YYYY-MM-DD HH:MM:SS'",
        ),
    },
)


@reservation_ns.route("/date_range", methods=["GET"])
class ReservationDateRange(Resource):

    @jwt_required()
    @reservation_ns.doc("get_reservations_by_date_range")
    @reservation_ns.expect(reservation_date_range_model)
    def get(self):
        try:
            start_date = request.args.get("start_date")
            end_date = request.args.get("end_date")
            sort_by = request.args.get("sort_by", "start_date")
            descending = request.args.get("descending", "false").lower() == "true"

            if not start_date or not end_date:
                return {"message": "start_date and end_date are required"}, 400

            try:
                start_date_range = datetime.strptime(start_date, "%Y-%m-%dT%H:%M:%S")
                end_date_range = datetime.strptime(end_date, "%Y-%m-%dT%H:%M:%S")
            except ValueError:
                return {"message": "Invalid date format. Use YYYY-MM-DDTHH:MM:SS"}, 400

            reservations = ReservationRepository.get_by_date_range(
                start_date_range, end_date_range, sort_by, descending
            )

            if not reservations:
                return {
                    "message": "No reservations found in the specified date range."
                }, 404

            schema = ReservationSchema(many=True)
            return schema.dump(reservations), 200

        except Exception as e:
            return {"message": "Error retrieving reservations: " + str(e)}, 500
