class MemoryPipeline:

    @staticmethod
    def process(memory):

        # Lazy imports:
        # These modules are loaded only when a memory is processed,
        # not while the FastAPI server is starting.
        from app.services.document_intelligence_service import (
            DocumentIntelligenceService,
        )
        from app.ai.chunker import Chunker
        from app.ai.embedding import EmbeddingGenerator
        from app.vectorstore.chroma_manager import (
            add_memory,
            delete_memory,
        )

        print("Analyzing document...", flush=True)

        metadata = DocumentIntelligenceService.analyze(
            memory.raw_text
        )

        print("Chunking document...", flush=True)

        chunks = Chunker.split(
            memory.raw_text
        )

        print("Generating embeddings...", flush=True)

        embeddings = EmbeddingGenerator.generate(
            chunks
        )

        print("Saving vectors to Qdrant...", flush=True)

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
            "language": metadata.get(
                "language",
                "unknown"
            ),
            "sentiment": metadata.get(
                "sentiment",
                "neutral"
            ),
            "chunk_count": len(chunks),
        }