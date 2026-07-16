from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Text,
    JSON
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Memory(Base):
    __tablename__ = "memories"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    title = Column(String)

    raw_text = Column(Text)

    summary = Column(Text)

    # AI Classification
    memory_type = Column(String)

    # Existing Metadata
    keywords = Column(JSON)
    topics = Column(JSON)

    # Structured Metadata
    people = Column(JSON)
    organizations = Column(JSON)
    locations = Column(JSON)
    dates = Column(JSON)
    products = Column(JSON)
    entities = Column(JSON)

    language = Column(String)

    sentiment = Column(String)

    source_type = Column(String)

    status = Column(String, default="UPLOADED")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    user = relationship("User")