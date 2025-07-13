"""
Inventory API Router

Handles all HTTP routes related to inventory management:
- Getting full inventory or single items
- Creating new snacks
- Updating existing snacks
- Incrementing/decrementing quantities

All routes are prefixed with /api/v1/inventory
"""
from fastapi import APIRouter
from models.snack import (
    PurchaseRequest,
    PurchaseResponse,
    Snack,
    SnackCreateSchema,
    SnackUpdateSchema,
    BulkSnackCreate,
    BulkSnackResponse
)
from models.inventory import InventoryResponse
from fastapi.responses import PlainTextResponse
from utils.db import (
    get_inventory, 
    get_snack, 
    delete_snack,
    create_snack,
    update_snack,
    create_bulk_items
)
import prometheus_client

router = APIRouter()

# Prometheus metrics
# track count of different types of snacks
snack_count = prometheus_client.Gauge(
    "snack_count",
    "Amount of snack types in inventory",
)

# track count of purchases
purchase_count = prometheus_client.Counter(
    "purchase_count",
    "Total number of snacks bought from inventory",
)

@router.get("/", response_model=InventoryResponse)
async def get_inventory_route():
    snacks = get_inventory()
    snack_count.set(len(snacks)) # set the counter to the current number of snacks
    return { "snacks": snacks }

@router.get("/snacks/{sku}", response_model=Snack)
async def get_snack_route(sku: str):
    snack = get_snack(sku)
    return snack

@router.post("/snacks", response_model=Snack)
async def create_snack_route(snack: SnackCreateSchema):
    snack_count.inc()
    return create_snack(snack)

@router.put("/snacks/{sku}", response_model=Snack)
async def update_snack_route(sku: str, updates: SnackUpdateSchema):
    return update_snack(sku, updates)

@router.post("/snacks/purchase", response_model=PurchaseResponse)
async def purchase_snack_route(request:PurchaseRequest):
    for purchase_request in request.purchase_requests:
        snack=get_snack(purchase_request.sku)
        update_snack(purchase_request.sku, SnackUpdateSchema(quantity=max(0,snack.quantity - purchase_request.quantity)))
        purchase_count.inc()
    return PurchaseResponse(success=True,message="Purchase successful",purchase_requests=request.purchase_requests) 

@router.delete("/snacks/{sku}", response_model=Snack)
async def delete_snack_route(sku: str):
    snack_count.dec(1)
    return delete_snack(sku)

@router.post("/snacks/bulk", response_model=BulkSnackResponse) 
async def create_bulk_route(request:BulkSnackCreate):
    try:
        bulk_items = create_bulk_items(request)
        return BulkSnackResponse(
            success=True,
            items=bulk_items,
            error=None
        )
    except Exception as e:
        return BulkSnackResponse(
            success=False,
            items=None,
            error=f"Error Processing bulk request:{str(e)}"
        )
