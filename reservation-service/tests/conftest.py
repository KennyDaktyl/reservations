import os
import tempfile

import pytest
from flask_migrate import upgrade

from app import create_app, db


@pytest.fixture(scope="session")
def app():
    db_fd, db_path = tempfile.mkstemp()
    app = create_app(config_type="testing", database_path=db_path)
    app.config["TESTING"] = True

    with app.app_context():
        upgrade()
        db.create_all()
        yield app

    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture(scope="session")
def client(app):
    return app.test_client()


@pytest.fixture(scope="function", autouse=True)
def init_database(app):
    with app.app_context():
        db.session.remove()
        db.drop_all()
        db.create_all()
        upgrade()
        yield db
        db.session.remove()
        db.drop_all()
