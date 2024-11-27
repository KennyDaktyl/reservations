Utórz sieć :
docker network create app-network

W każdym z mikroserwisów utówrz plik ".env"
i wklej:
SECRET_KEY=supersecretkey
JWT_SECRET_KEY=jwtsecret
FLASK_ENV=development

Różnice w zmiennych to DATABASE_URL!!!
auth-service
DATABASE_URL=postgresql://postgres_user:postgres_pass@postgres-service:5432/main_db

room-serivce
DATABASE_URL=postgresql://postgres_user:postgres_pass@postgres-service:5432/room_db

reservation-service
DATABASE_URL=postgresql://postgres_user:postgres_pass@postgres-service:5432/reservation_db

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

