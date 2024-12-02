from datetime import datetime, timedelta

import jwt
import pytest
from flask_jwt_extended import create_access_token

from app import db
from tests.factories import ReservationFactory


def generate_token(user_id, role, expires_in_hours=1):
    token = create_access_token(
        identity=str(user_id),
        additional_claims={"role": role},
        expires_delta=timedelta(hours=expires_in_hours),
    )
    return token


@pytest.fixture
def user_token(app):
    with app.app_context():
        return generate_token(user_id=1, role="user")


@pytest.fixture
def admin_token(app):
    with app.app_context():
        return generate_token(user_id=1, role="admin")


def test_generated_token(user_token):
    decoded_token = jwt.decode(user_token, options={"verify_signature": False})
    assert decoded_token["role"] == "user", "Rola powinna być 'user'"
    assert "exp" in decoded_token, "Token powinien mieć czas wygaśnięcia"


def test_endpoint_existence(client):
    response = client.get("/api/reservations/list_reservations")
    assert (
        response.status_code != 404
    ), "Endpoint `/api/reservations/list_reservations` nie istnieje!"


def test_missing_authorization(client):
    response = client.get("/api/reservations/list_reservations")
    assert response.status_code == 401
    assert response.json["message"] == "Missing 'Bearer' type in 'Authorization' header"


def test_user_token_content(user_token):
    import jwt

    decoded_token = jwt.decode(user_token, options={"verify_signature": False})
    assert decoded_token["role"] == "user", "Token powinien zawierać rolę 'user'"


def test_admin_required_access(client, user_token):
    headers = {"Authorization": f"Bearer {user_token}"}
    response = client.get(
        "/api/reservations/1",
        headers=headers,
    )

    assert (
        response.status_code == 403
    ), f"Unexpected status code: {response.status_code}"

    json_data = response.get_json()
    assert json_data is not None, "Response is not in JSON format!"
    assert (
        json_data["message"] == "Admins only!"
    ), f"Unexpected message: {json_data.get('message')}"


def test_create_reservation_conflict(client, admin_token):
    with client.application.app_context():
        start_date = datetime.now()
        end_date = start_date + timedelta(days=1)
        ReservationFactory(
            room_id=1, user_id=1, start_date=start_date, end_date=end_date
        )
        db.session.commit()

    payload = {
        "room_id": 1,
        "user_id": 2,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "room_data": {"id": 1, "name": "Test", "capacity": 0, "equipments": []},
        "user_data": {"id": 1, "email": "testowy@gmail.com", "role": "user"},
    }
    response = client.post(
        "/api/reservations/create_reservation",
        json=payload,
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    assert (
        response.status_code == 400
    ), f"Unexpected status code: {response.status_code}"

    assert "errors" in response.json, "Expected 'errors' key in response JSON"

    assert "room_id" in response.json["errors"], "Expected 'room_id' key in 'errors'"

    expected_message = f"Room {payload['room_data']["name"]} is not available from"
    assert (
        expected_message in response.json["errors"]["room_id"]
    ), f"Unexpected error message: {response.json['errors']['room_id']}"


def test_create_reservation_success(client, admin_token):
    start_date = datetime.now()
    end_date = start_date + timedelta(days=1)

    payload = {
        "room_id": 1,
        "user_id": 2,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "room_data": {"id": 1, "name": "Test", "capacity": 0, "equipments": []},
        "user_data": {"id": 1, "email": "testowy@gmail.com", "role": "user"},
    }
    response = client.post(
        "/api/reservations/create_reservation",
        json=payload,
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 201
    assert response.json["room_id"] == 1
    assert response.json["user_id"] == 2


def test_get_reservations_by_date_range(client, admin_token):
    with client.application.app_context():
        start_date = datetime.now().replace(microsecond=0)
        end_date = start_date + timedelta(days=1)
        ReservationFactory(
            room_id=1, user_id=2, start_date=start_date, end_date=end_date
        )
        db.session.commit()

    params = {
        "start_date": datetime.now().replace(microsecond=0).isoformat(),
        "end_date": (datetime.now() + timedelta(days=2))
        .replace(microsecond=0)
        .isoformat(),
    }
    response = client.get(
        f"/api/reservations/date_range?start_date={params['start_date']}&end_date={params['end_date']}",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]["room_id"] == 1


@pytest.mark.parametrize(
    "query_params,expected_count,expected_first_room_id",
    [
        ({"is_active": "true"}, 2, 10),
        ({"is_active": "false"}, 1, 10),
        ({"user_id": 1}, 2, 10),
        ({"room_id": 10}, 2, 10),
        ({"user_id": 1, "room_id": 20}, 1, 20),
        ({"sort_by": "start_date", "sort_order": "asc"}, 3, 10),
        ({"sort_by": "start_date", "sort_order": "desc"}, 3, 20),
    ],
)
def test_list_reservations(
    client, admin_token, query_params, expected_count, expected_first_room_id
):
    with client.application.app_context():
        ReservationFactory(
            id=1,
            user_id=1,
            room_id=10,
            cancel_date=None,
            start_date=datetime.now() + timedelta(days=1),
        )
        ReservationFactory(
            id=2,
            user_id=2,
            room_id=10,
            cancel_date=datetime.now(),
            start_date=datetime.now() + timedelta(days=2),
        )
        ReservationFactory(
            id=3,
            user_id=1,
            room_id=20,
            cancel_date=None,
            start_date=datetime.now() + timedelta(days=3),
        )
        db.session.commit()

    response = client.get(
        "/api/reservations/list_reservations",
        query_string=query_params,
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200
    assert len(response.json) == expected_count
    if expected_count > 0:
        assert response.json[0]["room_id"] == expected_first_room_id
