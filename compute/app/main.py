from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import health, embed


@asynccontextmanager
async def lifespan(app: FastAPI):
    from .services.embedder import Embedder
    app.state.embedder = Embedder(settings.model_name)
    yield
    app.state.embedder = None


def create_app(load_model: bool = True) -> FastAPI:
    app = FastAPI(
        title="Kairoo Compute",
        version="0.1.0",
        lifespan=lifespan if load_model else None,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.allowed_origin],
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )
    app.include_router(health.router)
    app.include_router(embed.router)
    return app


app = create_app()
