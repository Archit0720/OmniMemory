from sqlalchemy.orm import Session

from app.models.memory import Memory
from app.models.memory_relation import MemoryRelation


class MemoryGraphService:

    @staticmethod
    def get_graph(
        db: Session,
        user_id: int
    ):

        memories = (
            db.query(Memory)
            .filter(Memory.user_id == user_id)
            .all()
        )

        memory_ids = {
            memory.id
            for memory in memories
        }

        relations = (
            db.query(MemoryRelation)
            .filter(
                MemoryRelation.memory_id.in_(memory_ids),
                MemoryRelation.related_memory_id.in_(memory_ids)
            )
            .all()
        )

        nodes = []

        for index, memory in enumerate(memories):

            column = index % 3
            row = index // 3

            nodes.append({
                "id": str(memory.id),

                "position": {
                    "x": column * 320,
                    "y": row * 220
                },

                "data": {
                    "label": memory.title,
                    "memory_id": memory.id,
                    "summary": memory.summary or "",
                    "memory_type": memory.memory_type or "Memory",
                    "source_type": memory.source_type or "text",
                    "status": memory.status,
                    "products": memory.products or [],
                    "people": memory.people or [],
                    "organizations": memory.organizations or [],
                    "locations": memory.locations or [],
                    "dates": memory.dates or [],
                    "topics": memory.topics or [],
                    "keywords": memory.keywords or []
                }
            })

        edges = []

        for relation in relations:

            edges.append({
                "id": f"{relation.memory_id}-{relation.related_memory_id}",

                "source": str(relation.memory_id),

                "target": str(relation.related_memory_id),

                "label": relation.relation_type or "RELATED",

                "animated": True,

                "data": {
                    "confidence": relation.confidence or 0.0,
                    "shared_entities": relation.shared_entities or ""
                }
            })

        return {
            "nodes": nodes,
            "edges": edges
        }