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
    name: Optional[str]=None
    quantity: int

    class Config: # make it so the name would be in the response field for the bulk endpoint
        use_enum_values = True
        json_encoders = {Optional: lambda v: v if v is not None else ...}


# Request model for creating a new snack
class SnackCreateSchema(BaseModel):
    sku: str
    quantity: Optional[int] = None
    
# Request model for updating an existing snack
class SnackUpdateSchema(BaseModel):
    name: str
    quantity: int

class BulkSnackCreate(BaseModel):
    items:List[SnackCreateSchema]

class BulkSnackResponse(BaseModel):
    success:bool
    items:Optional[List[Snack]]=None
    error:Optional[str]=None