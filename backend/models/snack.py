"""
Snack Data Model

Defines the structure and validation rules for snack items in the inventory.
Uses Pydantic for data validation and serialization.
"""
from typing import List, Optional
from pydantic import BaseModel

# Snack Data Model
class Snack(BaseModel):
    sku: str
    name: Optional[str] = None
    quantity: int
    price: float
    description: Optional[str] = None
    category: Optional[str] = None
    photo_url: Optional[str] = None

# Request model for creating a new snack
class SnackCreateSchema(BaseModel):
    sku: str
    quantity: Optional[int] = None
    price: float
    description: Optional[str] = None
    category: Optional[str] = None
    photo_url: Optional[str] = None

# Request model for updating an existing snack
class SnackUpdateSchema(BaseModel):
    name: str
    quantity: int

class BulkSnackCreate(BaseModel):
    items:List[SnackCreateSchema]

class BulkSnackResponse(BaseModel):
    success:bool
    items:Optional[List[Snack]] = None
    error:Optional[str] = None