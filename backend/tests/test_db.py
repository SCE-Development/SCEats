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
    delete_snack,
    get_db_connection
)

from models.snack import SnackCreateSchema, SnackUpdateSchema
from pytest import fixture
# TODO: Implement your database tests here

@pytest.fixture # Martin was here :)
def test_create_snack(db):
    """Test creating a new snack"""
    get_db_connection(db)
    #Arrange:Prepares the data and Act: Adds the snacks to the db
    #create_snack(SnackCreateSchema(sku="12345",name="Coke Zero",quantity=20))
    #create_snack(SnackCreateSchema(sku="1629",name="Rice Krispy Treat",quantity=25))
    #create_snack(SnackCreateSchema(sku='4200',name='Gummy Bears', quantity=20)) 

@pytest.fixture
def test_get_snack(db):
    """Test retrieving a single snack"""
    get_db_connection(db)
    #Assert checks if conditions to check if the test passes or fails
    snack_I_Want=get_snack("12345")

    assert snack_I_Want.sku == "12345"
    assert snack_I_Want.name =='Coke Zero'

    assert snack_I_Want.quantity == 20

@pytest.fixture
def test_update_snack(db):
    """Test updating a snack"""
    get_db_connection(db)

    update_snack(sku="1629",updates=SnackUpdateSchema(name="Rice Krispy Treat",quantity=60)) #SCE went to a costco trip
    
    #Assert conditions

    snack_I_Want=get_snack('1629')

    assert snack_I_Want.quantity == 60


@pytest.fixture
def test_delete_snack(db):
    """Test deleting a snack"""
    get_db_connection(db)
    #Act:Delete the snack

    delete_snack('4200')

    assert get_snack('4200') ==None

    
@pytest.fixture
def test_get_inventory(db):
    """Test retrieving all snacks"""
    get_db_connection(db)
    grab_all_snacks=get_inventory()
    
    assert len(grab_all_snacks) > 0

    for i in grab_all_snacks:
        print(i)