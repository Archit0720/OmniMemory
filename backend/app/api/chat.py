from fastapi import APIRouter, Depends

from app.schemas.chat import ChatRequest
from app.rag.rag_service import RAGService
from app.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post("/ask")
def ask(
    request: ChatRequest,
    current_user=Depends(get_current_user)
):

    return RAGService.ask(
        question=request.question,
        user_id=current_user["id"]
    )