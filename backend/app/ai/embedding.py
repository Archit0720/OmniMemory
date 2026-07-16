from sentence_transformers import SentenceTransformer


class EmbeddingGenerator:

    model = SentenceTransformer(
        "BAAI/bge-small-en-v1.5"
    )

    @staticmethod
    def generate(texts):

        return EmbeddingGenerator.model.encode(
            texts,
            normalize_embeddings=True
        )