"""
API Integration Tests

Tests all API endpoints including:
- GET /inventory
- GET /snacks/{sku}
- POST /snacks
- PUT /snacks/{sku}
- DELETE /snacks/{sku}

TODO: Implement test cases for each endpoint
"""
from fastapi.testclient import TestClient
from main import app
from utils.db import get_db_connection
from dotenv import load_dotenv
import os
# TODO: Implement your API tests here
load_dotenv()
client=TestClient(app)


def test_create_snack(client):
    """Test creating a new snack"""
    #response = client.post("/api/v1/inventory/snacks", json={"sku": "12345", "name": "Coke Zero", "quantity": 20})
    #assert response.status_code == 200
    #assert response.json()['sku'] == "12345"
   # assert response.json()['name'] == "Coke Zero"
    #response = client.post("/api/v1/inventory/snacks", json={"sku": "1629", "name": "Rice Krispy Treat", "quantity": 40})
    #assert response.status_code ==200
   # assert response.json()['sku'] == "1629"
   # assert response.json['name'] =='Rice Krispy Treat'

   # response = client.post("/api/v1/inventory/snacks", json={"sku": "1629", "name": "Rice Krispy Treat", "quantity": 40})
   # assert response.status_code ==200
   # assert response.json()['sku'] == "1629"
   # assert response.json['name'] =='Rice Krispy Treat'

    #create_snack(SnackCreateSchema(sku='4200',name='Gummy Bears', quantity=20)) 

    #response=client.post("/api/v1/inventory/snakcs",json={"sku":"4200","name":"Gummy Bears","quantity":20})
    #assert response.status_code==200
    #assert response.json()['sku'] == '4200'
    #assert response.json['name']=='Gummy Bears'

    



def test_get_inventory(client):
    """Test retrieving all snacks"""
    response = client.get("/api/v1/inventory")
    assert response.status_code == 200
    inventory = response.json()
    print(f" Line 35 for get inventory test : {response.text}")
    assert len(inventory) > 0
   # assert any(snack['sku'] == "12345" for snack in inventory)


def test_get_snack(client):
    """Test retrieving a specific snack by SKU"""
    response = client.get(f"/api/v1/inventory/snacks/{'12345'}")
    assert response.status_code == 200


    snack = response.json()
    assert snack['sku'] == "12345"
    assert snack['name'] == "Coke Zero"

def test_update_snack(client):
    """Test updating an existing snack"""
    response = client.put(f"/api/v1/inventory/snacks/{'1629'}", json={"name": "Rice Krispy Treat", "quantity": 60})
    assert response.status_code == 200
    updated_snack = response.json()
    

    print(f" this is the test for line 55 for update_snack :{response.text}")
    #assert updated_snack['sku'] == "1629"

    #assert updated_snack['quantity'] == 60

    assert updated_snack['sku']

    assert updated_snack

def test_delete_snack(client):
    #"""Test deleting a snack"""
   response = client.delete(f"/api/v1/inventory/snacks/{'1629'}")
   assert response.status_code == 200  # Not found
