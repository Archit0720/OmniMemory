from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Float
)

from app.database.database import Base


class MemoryRelation(Base):

    __tablename__ = "memory_relations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    memory_id = Column(
        Integer,
        ForeignKey("memories.id")
    )

    related_memory_id = Column(
        Integer,
        ForeignKey("memories.id")
    )

    relation_type = Column(
        String
    )

    confidence = Column(
        Float,
        default=0.0
    )

    shared_entities = Column(
        String
    )