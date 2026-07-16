from app.models.memory import Memory
from app.models.memory_relation import MemoryRelation

from app.repositories.memory_relation_repository import (
    MemoryRelationRepository
)


class RelationService:

    @staticmethod
    def build(
        db,
        memory
    ):

        # Delete old relations
        MemoryRelationRepository.delete_existing(
            db,
            memory.id
        )

        existing = (
            db.query(Memory)
            .filter(
                Memory.user_id == memory.user_id,
                Memory.id != memory.id
            )
            .all()
        )

        for other in existing:

            shared = []

            # Products
            shared.extend(
                set(memory.products or [])
                &
                set(other.products or [])
            )

            # People
            shared.extend(
                set(memory.people or [])
                &
                set(other.people or [])
            )

            # Organizations
            shared.extend(
                set(memory.organizations or [])
                &
                set(other.organizations or [])
            )

            # Locations
            shared.extend(
                set(memory.locations or [])
                &
                set(other.locations or [])
            )

            # Topics
            shared.extend(
                set(memory.topics or [])
                &
                set(other.topics or [])
            )

            # Keywords
            shared.extend(
                set(memory.keywords or [])
                &
                set(other.keywords or [])
            )

            if len(shared) == 0:
                continue

            confidence = min(
                1.0,
                len(shared) / 5
            )

            relation = MemoryRelation(

                memory_id=memory.id,

                related_memory_id=other.id,

                relation_type="RELATED",

                confidence=confidence,

                shared_entities=",".join(shared)

            )

            MemoryRelationRepository.create(
                db,
                relation
            )