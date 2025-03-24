"""
Inventory API Router

Handles all HTTP routes related to inventory management:
- Getting full inventory or single items
- Creating new snacks
- Updating existing snacks
- Incrementing/decrementing quantities

All routes are prefixed with /api/v1/inventory
"""
from fastapi import FastAPI
from fastapi import APIRouter

from models.snack import (
    Snack,
    SnackCreateSchema,
    SnackUpdateSchema
)
from models.inventory import InventoryResponse
from utils.db import (
    get_inventory, 
    get_snack, 
    delete_snack,
    create_snack,
    update_snack
)

router = APIRouter()

@router.get("/", response_model=InventoryResponse)
async def get_inventory_route():
    snacks = get_inventory()
    return { "snacks": snacks }

@router.get("/snacks/{sku}", response_model=Snack)
async def get_snack_route(sku: str):
    snack = get_snack(sku)
    return snack

@router.post("/snacks", response_model=Snack)
async def create_snack_route(snack: SnackCreateSchema):
    return create_snack(snack)

@router.put("/snacks/{sku}", response_model=Snack)
async def update_snack_route(sku: str, updates: SnackUpdateSchema):
    return update_snack(sku, updates)
    
@router.delete("/snacks/{sku}", response_model=Snack)
async def delete_snack_route(sku: str):
    return delete_snack(sku)