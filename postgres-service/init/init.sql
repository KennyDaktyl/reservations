CREATE DATABASE auth_db;
CREATE USER auth_user WITH PASSWORD 'auth_password';
GRANT ALL PRIVILEGES ON DATABASE auth_db TO auth_user;

CREATE DATABASE room_db;
CREATE USER room_user WITH PASSWORD 'room_password';
GRANT ALL PRIVILEGES ON DATABASE room_db TO room_user;

CREATE DATABASE reservation_db;
CREATE USER reservation_user WITH PASSWORD 'reservation_password';
GRANT ALL PRIVILEGES ON DATABASE reservation_db TO reservation_user;


CREATE DATABASE test_db;
CREATE USER test_user WITH PASSWORD 'test_password';
GRANT ALL PRIVILEGES ON DATABASE test_db TO test_user;


CREATE DATABASE test_auth_db;
CREATE USER test_auth_user WITH PASSWORD 'test_auth_password';
GRANT ALL PRIVILEGES ON DATABASE test_auth_db TO test_auth_user;
