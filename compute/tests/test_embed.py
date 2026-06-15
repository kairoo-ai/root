import pytest
from fastapi.testclient import TestClient
from app.main import create_app
from app.config import settings

AUTH = {"Authorization": f"Bearer {settings.compute_shared_secret}"}


@pytest.fixture(scope="module")
def warm_client():
    with TestClient(create_app(load_model=True)) as c:
        yield c


def test_embed_requires_auth(warm_client):
    r = warm_client.post("/v1/embed", json={"texts": ["hello"]})
    assert r.status_code == 401


def test_embed_returns_384_dim_vectors(warm_client):
    r = warm_client.post("/v1/embed", json={"texts": ["hello", "world"]}, headers=AUTH)
    assert r.status_code == 200
    body = r.json()
    assert body["dim"] == 384
    assert len(body["vectors"]) == 2
    assert len(body["vectors"][0]) == 384


def test_embed_is_deterministic(warm_client):
    a = warm_client.post("/v1/embed", json={"texts": ["repeatable"]}, headers=AUTH).json()
    b = warm_client.post("/v1/embed", json={"texts": ["repeatable"]}, headers=AUTH).json()
    assert a["vectors"][0][:5] == b["vectors"][0][:5]
