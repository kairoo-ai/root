from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from ..auth import require_bearer

router = APIRouter(prefix="/v1", dependencies=[Depends(require_bearer)])


class EmbedRequest(BaseModel):
    texts: list[str] = Field(..., min_length=1, max_length=256)
    normalize: bool = True


class EmbedResponse(BaseModel):
    model: str
    dim: int
    vectors: list[list[float]]


@router.post("/embed", response_model=EmbedResponse)
def embed(req: EmbedRequest, request: Request) -> EmbedResponse:
    embedder = getattr(request.app.state, "embedder", None)
    if embedder is None:
        raise HTTPException(status_code=503, detail="model not loaded")
    vectors = embedder.encode(req.texts, normalize=req.normalize)
    return EmbedResponse(model=embedder.model_name, dim=embedder.dim, vectors=vectors)
