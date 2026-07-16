from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str


class Source(BaseModel):
    title: str
    memory_id: str
    chunk_index: int
    source_type: str
    score: float


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]