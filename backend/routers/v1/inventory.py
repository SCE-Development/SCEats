"""
Inventory API Router

Handles all HTTP routes related to inventory management:
- Getting full inventory or single items
- Creating new snacks
- Updating existing snacks
- Incrementing/decrementing quantities

All routes are prefixed with /api/v1/inventory
"""
from fastapi import APIRouter, HTTPException
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
    try:
        snacks = get_inventory()
        if not snacks:
            raise HTTPException(status_code=404, details= {
                "error": {
                    "code": "SNACKS_NOT_FOUND",
                    "message": "No snacks found in the inventory"
                }
            })
        return { "snacks": snacks }
    except Exception as e:
        raise HTTPException(status_code=500, detail=
                            {
                                "error": {
                                    "code": "INTERNAL_SERVER_ERROR",
                                    "message": "An internal error occured",
                                }
                            }
                            )
        

@router.get("/snacks/{sku}", response_model=Snack)
async def get_snack_route(sku: str):
    #check duplicate entry (i dont think this even needs to be here LOL)
    try:
        #check input validation (UPDATE THIS WHEN WE HAVE VALIDATION)
        if not sku:
            raise HTTPException(status_code=400, details={
                "error": {
                    "code": "INVALID_SKU",
                    "message": "SKU does not exist"
                }
            })
        snack = get_snack(sku)
        #check if snack exists
        if not snack:
            raise HTTPException(status_code=404, details= {
                    "error": {
                        "code": "SNACK_NOT_FOUND",
                        "message": "Snack with SKU {sku} not found"
                    }
                })
        return snack
    #check for internal server error
    except Exception as e:
        raise HTTPException(status_code=500, detail=
                            {
                                "error": {
                                    "code": "INTERNAL_SERVER_ERROR",
                                    "message": "An internal error occured",
                                }
                            })

@router.post("/snacks", response_model=Snack)
async def create_snack_route(snack: SnackCreateSchema):
    #check input validation (UPDATE THIS WHEN WE HAVE VALIDATION)
    #check duplicate entry (no method yet)
    try:
        snack = create_snack(snack)
        #check if snack exists
        if not snack:
            raise HTTPException(status_code=400, details= {
                "error": {
                    "code": "SNACK_NOT_CREATED",
                    "message": "Snack could not be created"
                }
            })
        return snack
    #check for internal server error
    except Exception as e:
        raise HTTPException(status_code=500, detail=
                            {
                                "error": {
                                    "code": "INTERNAL_SERVER_ERROR",
                                    "message": "An internal error occured",
                                }
                            })    

@router.put("/snacks/{sku}", response_model=Snack)
async def update_snack_route(sku: str, updates: SnackUpdateSchema):
    #check duplicate entry (no method yet)
    try:
        #check input validation (UPDATE THIS WHEN WE HAVE VALIDATION)
        if not sku:
            raise HTTPException(status_code=400, details={
                "error": {
                    "code": "INVALID_SKU",
                    "message": "SKU does not exist"
                }
            })
        
        updated = update_snack(sku, updates)
        #check if snack exists
        if not updated:
            raise HTTPException(status_code=404, details= {
                "error": {
                    "code": "SNACK_NOT_FOUND",
                    "message": "Snack with SKU {sku} not found"
                }
            })
        return updated
    #check for internal server error
    except Exception as e:
        raise HTTPException(status_code=500, detail=
                            {
                                "error": {
                                    "code": "INTERNAL_SERVER_ERROR",
                                    "message": "An internal error occured",
                                }
                            })
    
@router.delete("/snacks/{sku}", response_model=Snack)
async def delete_snack_route(sku: str):
    #check duplicate entry (no method yet)
    try:
        #check input validation (UPDATE THIS WHEN WE HAVE VALIDATION)
        if not sku:
            raise HTTPException(status_code=400, details={
                "error": {
                    "code": "INVALID_SKU",
                    "message": "SKU does not exist"
                }
            })
        snack = delete_snack(sku)
        #check if snack exists
        if not snack:
            raise HTTPException(status_code=404, details= {
                "error": {
                    "code": "SNACK_NOT_FOUND",
                    "message": "Snack with SKU {sku} not found"
                }
            })
        return snack
    #check for internal server error
    except Exception as e:
        raise HTTPException(status_code=500, detail=
                            {
                                "error": {
                                    "code": "INTERNAL_SERVER_ERROR",
                                    "message": "An internal error occured",
                                }
                            })