from datetime import datetime

from flask import Blueprint, request
from flask import send_file
from flask_jwt_extended import jwt_required
from flask_restx import Api, Resource, fields
from marshmallow import ValidationError

from openpyxl import Workbook

from io import BytesIO
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


@api.route("/list_reservations", methods=["GET"])
class ReservationList(Resource):

    @jwt_required()
    def get(self):
        is_active = request.args.get("is_active")
        sort_by = request.args.get("sort_by")
        sort_order = request.args.get("sort_order", "asc")
        user_id = request.args.get("user_id", type=int)
        room_id = request.args.get("room_id", type=int)
        date_start = request.args.get("date_start") 
        date_end = request.args.get("date_end")   

        if is_active is not None:
            is_active = is_active.lower() == "true"

        reservations = ReservationRepository.get_filtered(
            is_active=is_active,
            sort_by=sort_by,
            sort_order=sort_order,
            user_id=user_id,
            room_id=room_id,
            date_start=date_start,
            date_end=date_end,
        )

        schema = ReservationRespnoseSchema(many=True)
        return schema.dump(reservations), 200



@api.route("/create_reservation", methods=["POST"])
class ReservationCreate(Resource):

    @api.doc("create_reservation")
    @api.expect(reservation_model)
    @jwt_required()
    def post(self):
        try:
            user_data = request.json.get("user_data")
            room_data = request.json.get("room_data")

            if not user_data or not room_data:
                return {"message": "user_data and room_data are required."}, 400

            validated_data = self._validate_reservation_data(request.json)
            self._validate_dates(validated_data)

            if not self._is_room_available(validated_data)["available"]:
                conflicts = self._is_room_available(validated_data)["conflicts"]
                return {
                    "message": "Pokój jest już zarezerwowany w podanym terminie.",
                    "details": conflicts,
                }, 400


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
        availability = ReservationRepository.check_room_availability(
            data["room_id"], data["start_date"], data["end_date"]
        )
        return availability

    def _room_unavailable_response(self, data):
        room_name = data["room"]["name"]
        return {"message": f"Room {room_name} is already reserved in the specified date range."}, 400

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


@api.route("/<int:id>", methods=["GET", "DELETE"])
class ReservationDetail(Resource):

    def dispatch_request(self, *args, **kwargs):
        print(f"Handling method: {request.method}")
        return super().dispatch_request(*args, **kwargs)
    
    @admin_required
    def get(self, id):
        reservation = ReservationRepository.get_by_id(id)
        if not reservation:
            return {"message": "Reservation not found"}, 404

        schema = ReservationSchema()
        return schema.dump(reservation), 200

    @jwt_required()
    def delete(self, id):
        if not ReservationRepository.cancel(id):
            return {"message": "Reservation not found"}, 404
        
        reservation = ReservationRepository.cancel(id)
        notify_reservation_update("cancel", {"id": reservation.id, "room_id": reservation.room_id, "user_id": reservation.user_id, "user_data": reservation.user_data, "room_data": reservation.room_data, "room_data": reservation.room_data})
        return {"message": "Reservation canceled"}, 200


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


@api.route("/date_range", methods=["GET"])
class ReservationDateRange(Resource):

    @jwt_required()
    @api.doc("get_reservations_by_date_range")
    @api.expect(reservation_date_range_model)
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


@api.route("/export_reservations", methods=["POST"])
class ExportReservations(Resource):
    def post(self):
        try:
            filters = request.json or {}
            is_active = filters.get("is_active")
            user_id = filters.get("user_id")
            room_id = filters.get("room_id")
            date_start = filters.get("date_start")
            date_end = filters.get("date_end")

            if is_active is not None:
                is_active = str(is_active).lower() == "true"

            reservations = ReservationRepository.get_filtered(
                is_active=is_active,
                user_id=user_id,
                room_id=room_id,
                date_start=date_start,
                date_end=date_end,
            )

            wb = Workbook()
            ws = wb.active
            ws.title = "Rezerwacje"

            headers = ["ID", "Pokój", "Użytkownik", "Data rozpoczęcia", "Data zakończenia", "Status"]
            ws.append(headers)

            for reservation in reservations:
                ws.append([
                    reservation.id,
                    reservation.room_data.get("name") if reservation.room_data else "Brak",
                    reservation.user_data.get("email") if reservation.user_data else "Brak",
                    reservation.start_date.strftime("%Y-%m-%d %H:%M:%S"),
                    reservation.end_date.strftime("%Y-%m-%d %H:%M:%S"),
                    "Aktywna" if not reservation.cancel_date else "Anulowana"
                ])

            file_stream = BytesIO()
            wb.save(file_stream)
            file_stream.seek(0)

            filename = f"rezerwacje-{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.xlsx"
            return send_file(
                file_stream,
                as_attachment=True,
                download_name=filename,
                mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )

        except Exception as e:
            return {"message": f"Error exporting reservations: {str(e)}"}, 500
        