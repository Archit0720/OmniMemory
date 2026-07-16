from app.services.document_intelligence_service import (
    DocumentIntelligenceService,
)
from app.ai.chunker import Chunker
from app.ai.embedding import EmbeddingGenerator

from app.vectorstore.chroma_manager import (
    add_memory,
    delete_memory,
)


class MemoryPipeline:

    @staticmethod
    def process(memory):

        print("Analyzing document...")

        metadata = DocumentIntelligenceService.analyze(
            memory.raw_text
        )

        print("Chunking document...")

        chunks = Chunker.split(
            memory.raw_text
        )

        print("Generating embeddings...")

        embeddings = EmbeddingGenerator.generate(
            chunks
        )

        print("Saving vectors to Qdrant...")

        delete_memory(memory.id)

        add_memory(
            memory_id=memory.id,
            user_id=memory.user_id,
            title=metadata["title"],
            source_type=memory.source_type,
            chunks=chunks,
            embeddings=embeddings,
            upload_date=(
                str(memory.created_at.date())
                if getattr(memory, "created_at", None)
                else ""
            ),
            memory_type=metadata.get("memory_type"),
            people=metadata.get("people", []),
            organizations=metadata.get(
                "organizations",
                []
            ),
            locations=metadata.get("locations", []),
            dates=metadata.get("dates", []),
            products=metadata.get("products", []),
        )

        return {
            "summary": metadata["summary"],
            "title": metadata["title"],
            "memory_type": metadata.get(
                "memory_type"
            ),
            "keywords": metadata.get(
                "keywords",
                []
            ),
            "topics": metadata.get(
                "topics",
                []
            ),
            "people": metadata.get(
                "people",
                []
            ),
            "organizations": metadata.get(
                "organizations",
                []
            ),
            "locations": metadata.get(
                "locations",
                []
            ),
            "dates": metadata.get(
                "dates",
                []
            ),
            "products": metadata.get(
                "products",
                []
            ),
            "entities": metadata.get(
                "entities",
                []
            ),
            "language": metadata["language"],
            "sentiment": metadata["sentiment"],
            "chunk_count": len(chunks),
        }