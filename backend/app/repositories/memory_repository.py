from sqlalchemy.orm import Session
from app.models.memory import Memory


class MemoryRepository:

    @staticmethod
    def create(db: Session, memory: Memory):
        db.add(memory)
        db.commit()
        db.refresh(memory)
        return memory

    @staticmethod
    def get_all_by_user(db: Session, user_id: int):
        return (
            db.query(Memory)
            .filter(Memory.user_id == user_id)
            .all()
        )

    @staticmethod
    def update(db: Session, memory: Memory):
        db.commit()
        db.refresh(memory)
        return memory

    @staticmethod
    def delete(db: Session, memory: Memory):
        db.delete(memory)
        db.commit()

    @staticmethod
    def get_by_id(
        db: Session,
        user_id: int,
        memory_id: int
    ):
        return (
            db.query(Memory)
            .filter(
                Memory.id == memory_id,
                Memory.user_id == user_id
            )
            .first()
        )

    @staticmethod
    def get_by_ids(
        db: Session,
        user_id: int,
        memory_ids: list[int]
    ):
        return (
            db.query(Memory)
            .filter(
                Memory.user_id == user_id,
                Memory.id.in_(memory_ids)
            )
            .all()
        )

    @staticmethod
    def search(
        db: Session,
        user_id: int,
        query: str
    ):
        return (
            db.query(Memory)
            .filter(
                Memory.user_id == user_id,
                Memory.title.ilike(f"%{query}%")
            )
            .all()
        )
    
    @staticmethod
    def get_graph_memories(
        db: Session,
        user_id: int
    ):
        return (
            db.query(Memory)
            .filter(Memory.user_id == user_id)
            .all()
        )