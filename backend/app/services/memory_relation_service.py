from app.repositories.memory_relation_repository import (
    MemoryRelationRepository
)

from app.repositories.memory_repository import (
    MemoryRepository
)


class MemoryRelationService:

    @staticmethod
    def get_related_memories(
        db,
        user_id,
        memory_id
    ):

        relations = MemoryRelationRepository.get_related(
            db,
            memory_id
        )

        response = []

        for relation in relations:

            memory = MemoryRepository.get_by_id(
                db=db,
                user_id=user_id,
                memory_id=relation.related_memory_id
            )

            if not memory:
                continue

            response.append({

                "memory_id": memory.id,

                "title": memory.title,

                "summary": memory.summary,

                "memory_type": memory.memory_type,

                "confidence": relation.confidence,

                "shared_entities": relation.shared_entities.split(",")

            })

        return response