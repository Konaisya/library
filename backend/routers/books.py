from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile
from dependencies import get_book_service, BookService
from schemas.books import *
from utils.enums import Status
from utils.image import save_image

router = APIRouter()

@router.get('/', status_code=200)
async def get_all_books_filter_by(name: str | None = Query(None),
                                  description: str | None = Query(None),
                                  id_publisher: int | None = Query(None),
                                  year: int | None = Query(None),
                                  ISBN: str | None = Query(None),
                                  id_genre: int | None = Query(None),
                                  id_author: int | None = Query(None),
                                  book_service: BookService = Depends(get_book_service)):
    filter = {k: v for k, v in locals().items() if v is not None and k != "book_service" and k != "id_genre" and k != "id_author"}
    books = book_service.get_all_books_filter_by(id_author=id_author, id_genre=id_genre, **filter)
    response = [Book(**book.__dict__) for book in books]
    return response

@router.get('/{id}', status_code=200)
async def get_book(id: int, book_service: BookService = Depends(get_book_service)):
    book = book_service.get_one_book_filter_by(id=id)
    if not book:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    return {'status': Status.SUCCESS.value, 'new_book':Book(**book.__dict__)}

