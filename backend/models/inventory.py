"""
Inventory Response Model

Defines the structure for inventory-related API responses.
Contains a list of Snack objects representing the current inventory state.
"""
from models.snack import Snack
from pydantic import BaseModel
from typing import List

# Inventory Response Model
class InventoryResponse(BaseModel):
    snacks: List[Snack]