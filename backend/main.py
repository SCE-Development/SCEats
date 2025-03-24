"""
Main Application Entry Point

Initializes the FastAPI application with:
- CORS middleware configuration
- API route registration
- Server configuration

The application serves the inventory management system's API endpoints.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import make_asgi_app
import uvicorn

from routers.v1 import inventory
from routers.v1 import metrics

app = FastAPI()

# testing if routing works
# metrics_app = make_asgi_app()
# app.mount("/metrics2", metrics_app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(inventory.router, prefix="/api/v1/inventory")
app.include_router(metrics.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
