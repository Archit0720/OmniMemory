from sqlalchemy.orm import Session

from app.models.memory import Memory
from app.repositories.memory_repository import MemoryRepository
from app.schemas.memory import MemoryCreate
from app.pipeline.memory_pipeline import MemoryPipeline
from app.utils.pdf_reader import PDFReader
from app.services.relation_service import RelationService


class MemoryService:

    @staticmethod
    def create_memory(
        db: Session,
        user_id: int,
        memory_data: MemoryCreate
    ):

        memory = Memory(
            user_id=user_id,
            title=memory_data.title,
            raw_text=memory_data.text,
            source_type="text",
            status="UPLOADED"
        )

        memory = MemoryRepository.create(db, memory)

        result = MemoryPipeline.process(memory)

        memory.title = result["title"]
        memory.summary = result["summary"]
        memory.memory_type = result["memory_type"]

        memory.keywords = result["keywords"]
        memory.topics = result["topics"]

        memory.people = result["people"]
        memory.organizations = result["organizations"]
        memory.locations = result["locations"]
        memory.dates = result["dates"]
        memory.products = result["products"]
        memory.entities = result["entities"]

        memory.language = result["language"]
        memory.sentiment = result["sentiment"]

        memory.status = "READY"

        MemoryRepository.update(db, memory)

        # Build knowledge graph relations
        RelationService.build(
            db=db,
            memory=memory
        )

        return memory

    @staticmethod
    def create_pdf_memory(
        db: Session,
        user_id: int,
        file
    ):

        text = PDFReader.extract_text(file.file)

        memory = Memory(
            user_id=user_id,
            title=file.filename,
            raw_text=text,
            source_type="pdf",
            status="UPLOADED"
        )

        memory = MemoryRepository.create(
            db,
            memory
        )

        result = MemoryPipeline.process(memory)

        memory.title = result["title"]
        memory.summary = result["summary"]
        memory.memory_type = result["memory_type"]

        memory.keywords = result["keywords"]
        memory.topics = result["topics"]

        memory.people = result["people"]
        memory.organizations = result["organizations"]
        memory.locations = result["locations"]
        memory.dates = result["dates"]
        memory.products = result["products"]
        memory.entities = result["entities"]

        memory.language = result["language"]
        memory.sentiment = result["sentiment"]

        memory.status = "READY"

        MemoryRepository.update(
            db,
            memory
        )

        # Build knowledge graph relations
        RelationService.build(
            db=db,
            memory=memory
        )

        return memory

    @staticmethod
    def get_user_memories(
        db: Session,
        user_id: int
    ):

        return MemoryRepository.get_all_by_user(
            db,
            user_id
        )

    @staticmethod
    def get_dashboard_stats(
        db: Session,
        user_id: int
    ):

        memories = MemoryRepository.get_all_by_user(
            db,
            user_id
        )

        total = len(memories)

        ready = len(
            [
                m for m in memories
                if m.status == "READY"
            ]
        )

        processing = len(
            [
                m for m in memories
                if m.status != "READY"
            ]
        )

        return {
            "total_memories": total,
            "ready_memories": ready,
            "processing_memories": processing
        }

    @staticmethod
    def delete_memory(
        db: Session,
        user_id: int,
        memory_id: int
    ):

        memory = db.query(Memory).filter(
            Memory.id == memory_id,
            Memory.user_id == user_id
        ).first()

        if not memory:
            raise Exception("Memory not found")

        MemoryRepository.delete(
            db,
            memory
        )

        return {
            "message": "Memory deleted successfully"
        }

    @staticmethod
    def get_memory(
        db: Session,
        user_id: int,
        memory_id: int
    ):

        memory = MemoryRepository.get_by_id(
            db,
            user_id,
            memory_id
        )

        if not memory:
            raise Exception("Memory not found")

        return memory

    @staticmethod
    def search_memories(
        db: Session,
        user_id: int,
        query: str
    ):

        return MemoryRepository.search(
            db=db,
            user_id=user_id,
            query=query
        )

    @staticmethod
    def update_memory(
        db: Session,
        memory_id: int,
        user_id: int,
        memory_data
    ):

        memory = db.query(Memory).filter(
            Memory.id == memory_id,
            Memory.user_id == user_id
        ).first()

        if not memory:
            return None

        memory.title = memory_data.title
        memory.raw_text = memory_data.text
        memory.status = "PROCESSING"

        MemoryRepository.update(db, memory)

        result = MemoryPipeline.process(memory)

        memory.title = result["title"]
        memory.summary = result["summary"]
        memory.memory_type = result["memory_type"]

        memory.keywords = result["keywords"]
        memory.topics = result["topics"]

        memory.people = result["people"]
        memory.organizations = result["organizations"]
        memory.locations = result["locations"]
        memory.dates = result["dates"]
        memory.products = result["products"]
        memory.entities = result["entities"]

        memory.language = result["language"]
        memory.sentiment = result["sentiment"]

        memory.status = "READY"

        MemoryRepository.update(db, memory)

        # Rebuild relations after update
        RelationService.build(
            db=db,
            memory=memory
        )

        return memory