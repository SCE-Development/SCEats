"""
Snack Data Model

Defines the structure and validation rules for snack items in the inventory.
Uses Pydantic for data validation and serialization.
"""
from typing import Optional
from pydantic import BaseModel

# Snack Data Model
class Snack(BaseModel):
    sku: str
    name: str
    quantity: int

# Request model for creating a new snack
class SnackCreateSchema(BaseModel):
    sku: str
    name: str
    quantity: Optional[int] = None
    
# Request model for updating an existing snack
class SnackUpdateSchema(BaseModel):
    name: str
    quantity: int