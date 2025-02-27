"""
PyTest Configuration and Fixtures

Provides common test fixtures and configuration for all test modules.
Add your fixtures here as needed.
"""
import os
import pytest
from fastapi.testclient import TestClient
from main import app
from utils.db import init_db, get_db_connection

@pytest.fixture
def test_db():
    """Creates a temporary test database"""
    test_db_path = "data/test.sqlite3"
    # Initialize test database
    init_db(test_db_path)
    yield test_db_path
    # Cleanup after tests
    if os.path.exists(test_db_path):
        os.remove(test_db_path)

@pytest.fixture
def client():
    """Creates a test client for the FastAPI application"""
    return TestClient(app)

@pytest.fixture
def db(test_db):
    """Provides a database connection for tests"""
    with get_db_connection(test_db) as conn:
        yield conn 