from pydantic import BaseModel


class MemoryCreate(BaseModel):
    title: str
    text: str


class MemoryResponse(BaseModel):
    id: int

    title: str

    summary: str | None

    memory_type: str | None

    keywords: list | None

    topics: list | None

    people: list | None

    organizations: list | None

    locations: list | None

    dates: list | None

    products: list | None

    entities: list | None

    language: str | None

    sentiment: str | None

    status: str

    class Config:
        from_attributes = True


class MemoryUpdate(BaseModel):
    title: str
    text: str