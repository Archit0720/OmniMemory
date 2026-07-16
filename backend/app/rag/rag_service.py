from app.rag.retriever import Retriever
from app.rag.prompt_builder import PromptBuilder
from app.services.document_intelligence_service import client

from app.database.database import SessionLocal
from app.repositories.memory_repository import MemoryRepository
from app.services.memory_relation_service import MemoryRelationService


class RAGService:

    @staticmethod
    def ask(question: str, user_id: int):

        # --------------------------------
        # Step 1 : Semantic Retrieval
        # --------------------------------

        contexts = Retriever.search(
            query=question,
            user_id=user_id
        )

        if len(contexts) == 0:
            return {
                "answer": "I couldn't find this information in your memories.",
                "sources": []
            }

        db = SessionLocal()

        try:

            # --------------------------------
            # Step 2 : Expand using Graph
            # --------------------------------

            expanded = []

            for ctx in contexts:

                related = MemoryRelationService.get_related_memories(
                    db=db,
                    user_id=user_id,
                    memory_id=int(ctx["memory_id"])
                )

                expanded.extend(related)

            combined = {}

            for ctx in contexts:
                combined[int(ctx["memory_id"])] = ctx

            for relation in expanded:

                if relation["memory_id"] not in combined:

                    combined[relation["memory_id"]] = {
                        "memory_id": relation["memory_id"],
                        "title": relation["title"],
                        "summary": relation["summary"],
                        "memory_type": relation["memory_type"],
                        "text": relation["summary"],
                        "score": relation["confidence"],
                        "products": [],
                        "people": [],
                        "organizations": [],
                        "locations": [],
                        "dates": [],
                        "topics": [],
                        "keywords": [],
                        "entities": []
                    }

            contexts = list(combined.values())

            # --------------------------------
            # Step 3 : Load Complete Metadata
            # --------------------------------

            memory_ids = [
                int(ctx["memory_id"])
                for ctx in contexts
            ]

            memories = MemoryRepository.get_by_ids(
                db=db,
                user_id=user_id,
                memory_ids=memory_ids
            )

            memory_lookup = {
                memory.id: memory
                for memory in memories
            }

            enriched_contexts = []

            for ctx in contexts:

                memory = memory_lookup.get(
                    int(ctx["memory_id"])
                )

                if memory:

                    enriched_contexts.append({

                        **ctx,

                        "summary": memory.summary,
                        "keywords": memory.keywords,
                        "topics": memory.topics,

                        "memory_type": memory.memory_type,

                        "people": memory.people,
                        "organizations": memory.organizations,
                        "locations": memory.locations,
                        "dates": memory.dates,
                        "products": memory.products,
                        "entities": memory.entities,

                        "created_at": str(memory.created_at)

                    })

                else:

                    enriched_contexts.append(ctx)

        finally:

            db.close()

        # --------------------------------
        # Debug
        # --------------------------------

        print("\n========== FINAL CONTEXTS ==========\n")

        for c in enriched_contexts:
            print(c)

        print("\n====================================\n")

        # --------------------------------
        # Prompt
        # --------------------------------

        prompt = PromptBuilder.build(
            question,
            enriched_contexts
        )

        response = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            temperature=0.2,

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        answer = response.choices[0].message.content

        return {
            "answer": answer,
            "sources": enriched_contexts
        }