from sqlalchemy.orm import Session

from app.models.memory_relation import MemoryRelation


class MemoryRelationRepository:

    @staticmethod
    def create(
        db: Session,
        relation: MemoryRelation
    ):
        db.add(relation)
        db.commit()
        db.refresh(relation)
        return relation

    @staticmethod
    def delete_existing(
        db: Session,
        memory_id: int
    ):

        db.query(
            MemoryRelation
        ).filter(
            MemoryRelation.memory_id == memory_id
        ).delete()

        db.commit()

    @staticmethod
    def get_related(
        db: Session,
        memory_id: int
    ):

        return (
            db.query(MemoryRelation)
            .filter(
                MemoryRelation.memory_id == memory_id
            )
            .order_by(
                MemoryRelation.confidence.desc()
            )
            .all()
        )