# DEMO: [Reservations App](https://reservations.resto-app.pl/)

## Tworzenie wspólnej sieci dla Dockerów

Wykonaj poniższą komendę, aby utworzyć wspólną sieć dla kontenerów Docker:

docker network create app-network

---

## Konfiguracja plików `.env` dla uruchomienia lokalnie utwórz `exports.txt`

W każdym z mikroserwisów utwórz plik `.env` (obok folderu `app/`) i wklej odpowiednie wartości:

### auth-service

**Dla Docker:**
SECRET_KEY=supersecretkey
DATABASE_URL=postgresql://postgres_user:postgres_pass@postgres-service:5432/main_db
JWT_SECRET_KEY=jwtsecret
FLASK_ENV=production

**Lokalnie:**
export SECRET_KEY=supersecretkey
export DATABASE_URL=postgresql://postgres_user:postgres_pass@127.0.0.1:5433/main_db
export JWT_SECRET_KEY=jwtsecret
export FLASK_ENV=development

---

### room-service

**Dla Docker:**
DATABASE_URL=postgresql://postgres_user:postgres_pass@postgres-service:5432/room_db
SECRET_KEY=supersecretkey
JWT_SECRET_KEY=jwtsecret
FLASK_ENV=development

**Lokalnie:**
export DATABASE_URL=postgresql://postgres_user:postgres_pass@127.0.0.1:5433/room_db
export SECRET_KEY=supersecretkey
export JWT_SECRET_KEY=jwtsecret
export FLASK_ENV=development

---

### reservation-service

**Dla Docker:**
SECRET_KEY=supersecretkey
DATABASE_URL=postgresql://postgres_user:postgres_pass@postgres-service:5432/reservation_db
JWT_SECRET_KEY=jwtsecret
FLASK_ENV=production
PYTHONPATH=/app
PORT=5010

**Lokalnie:**
export SECRET_KEY=supersecretkey
export DATABASE_URL=postgresql://postgres_user:postgres_pass@127.0.0.1:5433/reservation_db
export TEST_DATABASE_URL="postgresql://postgres_user:postgres_pass@localhost:5433/test_db"
export JWT_SECRET_KEY=jwtsecret
export FLASK_ENV=development
export PORT=5010

---

## Uruchamianie dockerów

Uruchom poszczególne mikroserwisy w odpowiedniej kolejności:

1. Postgres
cd postgres-service
sudo docker-compose up --build -d
cd ..

2. Auth-service
cd auth-service
sudo docker-compose up --build -d
cd ..

3. Room-service
cd room-service
sudo docker-compose up --build -d
cd ..

4. Reservation-service
cd reservation-service
sudo docker-compose up --build -d

---

## Uruchamianie lokalnie

1. Utwórz dla każdego z mikroserwisów python środowisko
virtualenv -p python3 env
source enb/bin/activate
pip install -r requirements.txt
source exports.txt


flask run --host=127.0.0.1 --port=5100 (dla auth)
flask run --host=127.0.0.1 --port=5005 (dla rooms)
flask run --host=127.0.0.1 --port=5010 (dla reservations)

Uruchomienie front (nextjs)
pnpm install
pnpm dev

Uruchom poszczególne mikroserwisy w odpowiedniej kolejności:

### Uwagi

- Plik `.env` musi znajdować się w folderze każdego mikroserwisu.
- Link do demo aplikacji: [Reservations App](https://reservations.resto-app.pl/) 🔗
