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
snack_gauge = prometheus_client.Gauge(
    "snack_gauge",
    "Amount of snack types in inventory",
    ["sku"],
)

# track count of purchases
purchase_count = prometheus_client.Counter(
    "purchase_count",
    "Total number of snacks bought from inventory",
    ["sku"],
)

@router.get("/", response_model=InventoryResponse)
async def get_inventory_route():
    snacks = get_inventory()
    return { "snacks": snacks }

@router.get("/snacks/{sku}", response_model=Snack)
async def get_snack_route(sku: str):
    snack = get_snack(sku)
    snack_gauge.labels(sku=snack.sku).set(snack.quantity)
    return snack

@router.post("/snacks", response_model=Snack)
async def create_snack_route(snack: SnackCreateSchema):
    snack_gauge.labels(sku=snack.sku).set(1) # default value, change later
    return create_snack(snack)

@router.put("/snacks/{sku}", response_model=Snack)
async def update_snack_route(sku: str, updates: SnackUpdateSchema):
    return update_snack(sku, updates)

@router.post("/snacks/purchase", response_model=PurchaseResponse)
async def purchase_snack_route(request:PurchaseRequest):
    for purchase_request in request.purchase_requests:
        snack=get_snack(purchase_request.sku)
        update_snack(purchase_request.sku, SnackUpdateSchema(quantity=max(0,snack.quantity - purchase_request.quantity)))
        purchase_count.labels(sku=snack.sku).inc(purchase_request.quantity)
        snack_gauge.labels(sku=snack.sku).dec(purchase_request.quantity) # now that stuff is bought, decrease inventory count
    return PurchaseResponse(success=True,message="Purchase successful",purchase_requests=request.purchase_requests) 

@router.delete("/snacks/{sku}", response_model=Snack)
async def delete_snack_route(sku: str):
    snack_gauge.remove(sku)
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
