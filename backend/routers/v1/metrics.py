from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import make_asgi_app, generate_latest, CONTENT_TYPE_LATEST, CollectorRegistry, Counter
from starlette.responses import Response
import uvicorn

app = FastAPI()

router = APIRouter()

metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

registry = CollectorRegistry()

# we should have gauge and counter
# gauge for snack inventory count
# counter for times bought ?
@router.get("/metrics")
def get_metrics():
    return Response(generate_latest(registry), media_type=CONTENT_TYPE_LATEST)
