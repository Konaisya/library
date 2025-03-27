from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile
from dependencies import *
from schemas.books import *
from utils.enums import Status
from utils.image import save_image

router = APIRouter()

@router.post('/', status_code=201)
async def create_genre(genre_data: CreateGenre,
                       book_service: BookService = Depends(get_book_service)):
    new_genre = book_service.create_genre(genre_data)
    if new_genre == Status.FAILED.value:
        raise HTTPException(status_code=400, detail={'staus': Status.FAILED.value})
    return {'status': Status.SUCCESS.value, 'genre': new_genre}

@router.get('/', status_code=200)
async def get_all_genres_filter_by(name: str | None = Query(None),
                                   book_service: BookService = Depends(get_book_service)):
    filter = {k: v for k, v in locals().items() if v is not None and k != "book_service"}
    genres = book_service.get_all_genres_filter_by(**filter)
    response = [Genre(**genre.__dict__) for genre in genres]
    return response

@router.get('/{id}', status_code=200)
async def get_genre(id: int, book_service: BookService = Depends(get_book_service)):
    genre = book_service.get_one_genre_filter_by(id=id)
    if genre is None:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    return Genre(**genre.__dict__)

@router.put('/{id}', status_code=200)
async def update_genre(id: int, 
                       update_data: UpdateGenre,
                       book_service: BookService = Depends(get_book_service)):
    genre = book_service.get_one_genre_filter_by(id=id)
    if genre is None:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    genre_update = book_service.update_genre(id, update_data)
    return genre_update

@router.delete('/{id}', status_code=200)
async def delete_genre(id: int, book_service: BookService = Depends(get_book_service)):
    genre = book_service.get_one_genre_filter_by(id=id)
    if genre is None:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    genre_delete = book_service.delete_genre(id)
    return {'status': Status.SUCCESS.value}