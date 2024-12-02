DEMO (css-y Desktop):
https://reservations.resto-app.pl/


Utórz wspólną sieć dla dockerów:
docker network create app-network

W każdym z mikroserwisów utówrz plik ".env" (obok app/)
i wklej:

auth-service dla docker:

SECRET_KEY=supersecretkey
DATABASE_URL=postgresql://postgres_user:postgres_pass@postgres-service:5432/main_db
JWT_SECRET_KEY=jwtsecret
FLASK_ENV=production

lokalnie

export SECRET_KEY=supersecretkey
export DATABASE_URL=postgresql://postgres_user:postgres_pass@127.0.0.1:5433/main_db
export JWT_SECRET_KEY=jwtsecret
export FLASK_ENV=development


room-serivce dla docker

DATABASE_URL=postgresql://postgres_user:postgres_pass@postgres-service:5432/room_db
SECRET_KEY=supersecretkey
JWT_SECRET_KEY=jwtsecret
FLASK_ENV=development

lokalnie 

export DATABASE_URL=postgresql://postgres_user:postgres_pass@127.0.0.1:5433/room_db
export SECRET_KEY=supersecretkey
export JWT_SECRET_KEY=jwtsecret
export FLASK_ENV=development


reservation-service dla docker:

SECRET_KEY=supersecretkey
DATABASE_URL=postgresql://postgres_user:postgres_pass@postgres-service:5432/reservation_db
JWT_SECRET_KEY=jwtsecret
FLASK_ENV=production
PYTHONPATH=/app
PORT=5010

lokalnie

export SECRET_KEY=supersecretkey
export DATABASE_URL=postgresql://postgres_user:postgres_pass@127.0.0.1:5433/reservation_db
export TEST_DATABASE_URL="postgresql://postgres_user:postgres_pass@localhost:5433/test_db"
export JWT_SECRET_KEY=jwtsecret
export FLASK_ENV=development
export PORT=5010


Uruchamianie:

1 - POSTGRES
cd postgres-service
sudo docker-compose up --build -d
cd..

2 AUTH
cd auth-service
sudo docker-compose up --build -d
cd ..

3 ROOM
cd room-service
sudo docker-compose up --build -d
cd ..

4 RESERVATION
cd reservation-service
sudo docker-compose up --build -d

