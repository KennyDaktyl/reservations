import pytest

from tests.factories.user_factory import UserFactory


def create_user(client, email, password, role="user"):
    """Helper function to create a user in the database"""
    response = client.post(
        "/api/users/add",
        json={"email": email, "password": password, "role": role},
    )
    return response


def test_create_user(client):
    user = UserFactory.create()

    # Act
    response = create_user(
        client, user["email"], user["password"], user["role"]
    )

    # Assert
    assert response.status_code == 201
    response_data = response.get_json()

    assert response_data["email"] == user["email"]
    assert response_data["role"] == user["role"]
    assert "password" not in response_data


def test_create_user_with_existing_email(client):
    """Test for creating a user with an already existing email"""
    user = UserFactory.create()

    # Act
    response = client.post(
        "/api/users/add",
        json={
            "email": user["email"],
            "password": user["password"],
            "role": user["role"],
        },
    )

    # Assert
    assert response.status_code == 201

    # Act
    response = client.post(
        "/api/users/add",
        json={
            "email": user["email"],
            "password": user["password"],
            "role": user["role"],
        },
    )

    # Assert
    assert response.status_code == 400
    response_data = response.get_json()
    assert response_data["message"] == "User with this email already exists."


@pytest.mark.parametrize(
    "email, password, expected_errors",
    [
        (
            "",
            "short",
            {
                "email": [
                    "Not a valid email address.",
                    "Length must be between 5 and 120.",
                ],
                "password": ["Shorter than minimum length 6."],
            },
        ),
        (
            "invalidemail",
            "123",
            {
                "email": ["Not a valid email address."],
                "password": ["Shorter than minimum length 6."],
            },
        ),
        (
            "test@example.com",
            "short",
            {"password": ["Shorter than minimum length 6."]},
        ),
    ],
)
def test_create_user_with_invalid_data(
    client, email, password, expected_errors
):
    """
    Testuje tworzenie użytkownika z nieprawidłowymi danymi (email i hasło)
    Z parametryzacją testu, aby sprawdzić różne przypadki danych wejściowych.
    """

    # Act
    response = client.post(
        "/api/users/add",
        json={"email": email, "password": password, "role": "user"},
    )

    # Assert
    assert response.status_code == 400

    response_data = response.get_json()
    assert response_data["errors"] == expected_errors


@pytest.mark.parametrize(
    "email, password, expected_status",
    [
        ("testuser@example.com", "testpassword", 200),  # Valid login
        ("testuser@example.com", "wrongpassword", 401),  # Invalid password
        ("nonexistent@example.com", "anypassword", 401),  # Non-existent user
    ],
)
def test_login(client, email, password, expected_status):
    if expected_status == 200:  # Only create user for successful login tests
        create_user(
            client, "testuser@example.com", "testpassword", role="user"
        )

    # Act
    response = client.post(
        "/api/auth/login", json={"email": email, "password": password}
    )

    # Assert
    assert response.status_code == expected_status
    if expected_status == 200:
        response_data = response.get_json()
        assert "access_token" in response_data
    else:
        response_data = response.get_json()
        assert "errors" in response_data
