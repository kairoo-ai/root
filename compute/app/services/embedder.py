from __future__ import annotations
from sentence_transformers import SentenceTransformer


class Embedder:
    """Wraps a sentence-transformers model held warm in RAM."""

    def __init__(self, model_name: str):
        self.model_name = model_name
        self.model = SentenceTransformer(model_name)
        self.dim = self.model.get_sentence_embedding_dimension()

    def encode(self, texts: list[str], normalize: bool = True) -> list[list[float]]:
        vectors = self.model.encode(
            texts, normalize_embeddings=normalize, convert_to_numpy=True
        )
        return [v.tolist() for v in vectors]
