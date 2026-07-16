from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from fastapi import Query

from app.database.database import get_db
from app.schemas.memory import MemoryCreate, MemoryResponse ,MemoryUpdate
from app.services.memory_service import MemoryService
from app.auth.dependencies import get_current_user
from app.services.vision_service import VisionService
from app.models.memory import Memory
from app.pipeline.memory_pipeline import MemoryPipeline
from app.services.memory_relation_service import (
    MemoryRelationService
)
from app.services.memory_graph_service import MemoryGraphService

router = APIRouter(
    prefix="/memory",
    tags=["Memory"]
)


@router.post(
    "/create",
    response_model=MemoryResponse
)
def create_memory(
    memory: MemoryCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return MemoryService.create_memory(
        db=db,
        user_id=current_user["id"],
        memory_data=memory
    )


@router.post(
    "/upload-pdf",
    response_model=MemoryResponse
)
def upload_pdf(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return MemoryService.create_pdf_memory(
        db=db,
        user_id=current_user["id"],
        file=file
    )



@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    image_bytes = await file.read()

    extracted_text = VisionService.extract_text(
        image_bytes
    )

    memory = Memory(
    user_id=current_user["id"],
    title=file.filename,
    raw_text=extracted_text,
    source_type="IMAGE",
    status="PROCESSING"
)

    db.add(memory)
    db.commit()
    db.refresh(memory)

    metadata = MemoryPipeline.process(memory)

    memory.title = metadata["title"]
    memory.summary = metadata["summary"]

    memory.memory_type = metadata["memory_type"]

    memory.keywords = metadata["keywords"]
    memory.topics = metadata["topics"]

    memory.people = metadata["people"]
    memory.organizations = metadata["organizations"]
    memory.locations = metadata["locations"]
    memory.dates = metadata["dates"]
    memory.products = metadata["products"]
    memory.entities = metadata["entities"]

    memory.language = metadata["language"]
    memory.sentiment = metadata["sentiment"]

    memory.chunk_count = metadata["chunk_count"]
    memory.status = "READY"

    db.commit()

    return {
        "message": "Image uploaded successfully",
        "memory_id": memory.id
    }

@router.get("/stats")
def get_dashboard_stats(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return MemoryService.get_dashboard_stats(
        db=db,
        user_id=current_user["id"]
    )


@router.get("/search")
def search_memories(
    q: str = Query(...),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return MemoryService.search_memories(
        db=db,
        user_id=current_user["id"],
        query=q
    )

@router.get(
    "/list",
    response_model=list[MemoryResponse]
)
def get_memories(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return MemoryService.get_user_memories(
        db=db,
        user_id=current_user["id"]
    )

@router.delete("/delete/{memory_id}")
def delete_memory(
    memory_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return MemoryService.delete_memory(
        db=db,
        user_id=current_user["id"],
        memory_id=memory_id
    )

@router.get("/graph")
def get_memory_graph(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return MemoryGraphService.get_graph(
        db=db,
        user_id=current_user["id"]
    )

@router.get(
    "/{memory_id}",
    response_model=MemoryResponse
)
def get_memory(
    memory_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return MemoryService.get_memory(
        db=db,
        user_id=current_user["id"],
        memory_id=memory_id
    )


@router.put(
    "/{memory_id}",
    response_model=MemoryResponse
)
def update_memory(
    memory_id: int,
    memory: MemoryUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return MemoryService.update_memory(
        db=db,
        memory_id=memory_id,
        user_id=current_user["id"],
        memory_data=memory
    )

@router.get("/{memory_id}/related")
def get_related_memories(
    memory_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return MemoryRelationService.get_related_memories(
        db=db,
        user_id=current_user["id"],
        memory_id=memory_id
    )



