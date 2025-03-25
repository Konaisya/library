from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile
from dependencies import *
from schemas.books import *
from utils.enums import Status
from utils.image import save_image

router = APIRouter()

# Genres 
@router.get('/', status_code=200)
async def get_all_genres_filter_by(name: str | None = Query(None),
                                   book_service: BookService = Depends(get_book_service)):
    filter = {k: v for k, v in locals().items() if v is not None and k != "book_service"}
    genres = book_service.get_all_genres_filter_by(**filter)
    response = [Genre(**genre.__dict__) for genre in genres]
    return response

