"""
Database Utility Tests

Tests all database operations including:
- CRUD operations for snacks
- Database connection handling
- Schema initialization

TODO: Implement test cases for:
- Creating snacks
- Reading snacks
- Updating snacks
- Deleting snacks
- Getting inventory
"""
import pytest
from utils.db import (
    get_inventory,
    get_snack,
    create_snack,
    update_snack,
    delete_snack
)

from models.snack import SnackCreateSchema, SnackUpdateSchema

# TODO: Implement your database tests here

def test_create_snack(db):
    """Test creating a new snack"""
    

def test_get_snack(db):
    """Test retrieving a single snack"""

def test_update_snack(db):
    """Test updating a snack"""

def test_delete_snack(db):
    """Test deleting a snack"""
    

def test_get_inventory(db):
    """Test retrieving all snacks"""
