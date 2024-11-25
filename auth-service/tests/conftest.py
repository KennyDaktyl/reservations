import os
import tempfile
import pytest
from flask_migrate import upgrade
from app import create_app, db

# Fixture for creating Flask app
@pytest.fixture(scope="module")
def app():
    """Fixture for creating Flask app in testing mode"""
    db_fd, db_path = tempfile.mkstemp()
    
    app = create_app(config_type="testing")
    
    with app.app_context():
        upgrade()  
        yield app 
    
    os.close(db_fd)
    os.unlink(db_path)

@pytest.fixture(scope="module")
def client(app):
    """Fixture for creating test client"""
    return app.test_client()

@pytest.fixture(scope="module")
def init_database(app):
    """Fixture for initializing the database"""
    with app.app_context():
       
        upgrade()  
        yield db  
        db.drop_all() 
