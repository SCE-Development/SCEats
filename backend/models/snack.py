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
    name: Optional[str] = "snack"
    quantity: Optional[int] = 1
    price: Optional[float] = None
    description: Optional[str] = None
    category: Optional[str] = None
    photo_url: Optional[str] = None

# Request model for updating an existing snack
class SnackUpdateSchema(BaseModel):
    name: Optional[str] = None
    quantity: Optional[int] = None
    price: Optional[float] = None
    description: Optional[str] = None
    category: Optional[str] = None
    photo_url: Optional[str] = None

class BulkSnackCreate(BaseModel):
    items:List[SnackCreateSchema]

class BulkSnackResponse(BaseModel):
    success:bool
    items:Optional[List[Snack]] = None
    error:Optional[str] = None

class Purchase(BaseModel):
    sku:str
    quantity:int

class PurchaseRequest(BaseModel):
    purchase_requests:List[Purchase]

class PurchaseResponse(BaseModel):
    success:bool
    message:str
    purchase_requests:List[Purchase]