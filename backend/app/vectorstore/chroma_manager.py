from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    FieldCondition,
    Filter,
    MatchValue,
    PointStruct,
    VectorParams,
)

from app.core.config import settings


client = QdrantClient(
    url=settings.QDRANT_URL,
    api_key=settings.QDRANT_API_KEY,
)

COLLECTION_NAME = settings.QDRANT_COLLECTION


def ensure_collection(vector_size: int):
    existing_collections = client.get_collections().collections

    collection_exists = any(
        collection.name == COLLECTION_NAME
        for collection in existing_collections
    )

    if collection_exists:
        return

    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=vector_size,
            distance=Distance.COSINE,
        ),
    )


def add_memory(
    memory_id,
    user_id,
    title,
    source_type,
    chunks,
    embeddings,
    memory_type=None,
    people=None,
    organizations=None,
    locations=None,
    dates=None,
    products=None,
    upload_date=None,
):
    if len(chunks) == 0:
        return

    vector_size = len(embeddings[0])

    ensure_collection(vector_size)

    points = []

    for index, chunk in enumerate(chunks):
        point_id = int(f"{memory_id}{index:04d}")

        payload = {
            "memory_id": str(memory_id),
            "user_id": str(user_id),
            "title": title,
            "source_type": source_type,
            "chunk_index": index,
            "text": chunk,
            "memory_type": memory_type or "",
            "people": people or [],
            "organizations": organizations or [],
            "locations": locations or [],
            "dates": dates or [],
            "products": products or [],
            "upload_date": upload_date or "",
        }

        points.append(
            PointStruct(
                id=point_id,
                vector=embeddings[index].tolist(),
                payload=payload,
            )
        )

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points,
    )


def delete_memory(memory_id):
    existing_collections = client.get_collections().collections

    collection_exists = any(
        collection.name == COLLECTION_NAME
        for collection in existing_collections
    )

    if not collection_exists:
        return

    client.delete(
        collection_name=COLLECTION_NAME,
        points_selector=Filter(
            must=[
                FieldCondition(
                    key="memory_id",
                    match=MatchValue(
                        value=str(memory_id)
                    ),
                )
            ]
        ),
    )


def query_memories(
    query_embedding,
    user_id,
    top_k=10,
    memory_type=None,
    upload_date=None,
):
    existing_collections = client.get_collections().collections

    collection_exists = any(
        collection.name == COLLECTION_NAME
        for collection in existing_collections
    )

    if not collection_exists:
        return []

    conditions = [
        FieldCondition(
            key="user_id",
            match=MatchValue(
                value=str(user_id)
            ),
        )
    ]

    if memory_type:
        conditions.append(
            FieldCondition(
                key="memory_type",
                match=MatchValue(
                    value=memory_type
                ),
            )
        )

    if upload_date:
        conditions.append(
            FieldCondition(
                key="upload_date",
                match=MatchValue(
                    value=upload_date
                ),
            )
        )

    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_embedding.tolist(),
        query_filter=Filter(
            must=conditions
        ),
        limit=top_k,
        with_payload=True,
    )

    return results.points