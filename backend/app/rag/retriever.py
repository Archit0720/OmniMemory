from sqlalchemy.orm import Session

from app.ai.embedding import EmbeddingGenerator
from app.vectorstore.chroma_manager import query_memories

from app.database.database import SessionLocal
from app.models.memory import Memory

from app.services.query_planner import QueryPlanner
from app.services.date_resolver import DateResolver


class Retriever:

    @staticmethod
    def search(
        query: str,
        user_id: int,
        top_k: int = 10
    ):

        # ---------------------------
        # Query Planning
        # ---------------------------

        plan = QueryPlanner.plan(query)

        # ---------------------------
        # Generate Query Embedding
        # ---------------------------

        query_embedding = EmbeddingGenerator.generate(
            [query]
        )[0]

        # ---------------------------
        # Build Qdrant Filters
        # ---------------------------

        memory_mapping = {
            "receipt": "Receipt",
            "receipts": "Receipt",
            "invoice": "Invoice",
            "invoices": "Invoice",
            "note": "Note",
            "notes": "Note",
            "email": "Email",
            "emails": "Email",
            "document": "Document",
            "documents": "Document",
            "image": "Image",
            "images": "Image",
            "warranty": "Warranty",
            "warranties": "Warranty",
        }

        planned_memory_type = (
            plan.get("memory_type", "")
            or ""
        ).lower().strip()

        memory_type = memory_mapping.get(
            planned_memory_type
        )

        upload_date = DateResolver.resolve(
            plan.get("upload_date", "")
        )

        print("\n========== QUERY PLAN ==========")
        print(plan)
        print("================================\n")

        print("\n========== QDRANT FILTERS ==========")
        print({
            "user_id": str(user_id),
            "memory_type": memory_type,
            "upload_date": upload_date,
        })
        print("====================================\n")

        # ---------------------------
        # Qdrant Semantic Search
        # ---------------------------

        results = query_memories(
            query_embedding=query_embedding,
            user_id=user_id,
            top_k=top_k,
            memory_type=memory_type,
            upload_date=upload_date,
        )

        print("\n========== RAW QDRANT RESULTS ==========")

        for point in results:
            print({
                "id": point.id,
                "score": point.score,
                "payload": point.payload,
            })

        print("========================================\n")

        memory_map = {}

        for point in results:

            payload = point.payload or {}

            memory_id = int(
                payload["memory_id"]
            )

            score = round(
                float(point.score),
                3
            )

            if (
                memory_id not in memory_map
                or score > memory_map[memory_id]["score"]
            ):

                memory_map[memory_id] = {
                    "text": payload.get("text", ""),
                    "title": payload.get(
                        "title",
                        "Untitled Memory"
                    ),
                    "memory_id": memory_id,
                    "chunk_index": payload.get(
                        "chunk_index",
                        -1
                    ),
                    "source_type": payload.get(
                        "source_type",
                        "text"
                    ),
                    "score": score,

                    "memory_type": payload.get(
                        "memory_type",
                        ""
                    ),
                    "people": payload.get(
                        "people",
                        []
                    ),
                    "organizations": payload.get(
                        "organizations",
                        []
                    ),
                    "locations": payload.get(
                        "locations",
                        []
                    ),
                    "dates": payload.get(
                        "dates",
                        []
                    ),
                    "products": payload.get(
                        "products",
                        []
                    ),
                    "upload_date": payload.get(
                        "upload_date",
                        ""
                    ),
                }

        # ---------------------------
        # PostgreSQL Metadata Search
        # ---------------------------

        db: Session = SessionLocal()

        try:

            words = [
                word.strip()
                for word in query.lower().split()
                if word.strip()
            ]

            memories = (
                db.query(Memory)
                .filter(
                    Memory.user_id == user_id
                )
                .all()
            )

            for memory in memories:

                searchable = " ".join([
                    memory.title or "",
                    memory.summary or "",
                    memory.memory_type or "",
                    " ".join(memory.keywords or []),
                    " ".join(memory.topics or []),
                    " ".join(memory.products or []),
                    " ".join(memory.people or []),
                    " ".join(memory.organizations or []),
                    " ".join(memory.locations or []),
                    " ".join(memory.dates or []),
                ]).lower()

                if any(
                    word in searchable
                    for word in words
                ):

                    existing_result = memory_map.get(
                        memory.id
                    )

                    if (
                        existing_result is None
                        or existing_result["score"] < 0.95
                    ):

                        memory_map[memory.id] = {
                            "text": (
                                memory.raw_text
                                or memory.summary
                                or ""
                            ),
                            "title": (
                                memory.title
                                or "Untitled Memory"
                            ),
                            "memory_id": memory.id,
                            "chunk_index": -1,
                            "source_type": (
                                memory.source_type
                                or "text"
                            ),
                            "score": 0.95,

                            "memory_type": (
                                memory.memory_type
                                or ""
                            ),
                            "people": (
                                memory.people
                                or []
                            ),
                            "organizations": (
                                memory.organizations
                                or []
                            ),
                            "locations": (
                                memory.locations
                                or []
                            ),
                            "dates": (
                                memory.dates
                                or []
                            ),
                            "products": (
                                memory.products
                                or []
                            ),
                            "upload_date": (
                                str(memory.created_at.date())
                                if getattr(
                                    memory,
                                    "created_at",
                                    None
                                )
                                else ""
                            ),
                        }

        finally:
            db.close()

        # ---------------------------
        # Rank and Return
        # ---------------------------

        return sorted(
            memory_map.values(),
            key=lambda item: item["score"],
            reverse=True
        )[:5]