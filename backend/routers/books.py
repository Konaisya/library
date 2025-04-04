from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile
from dependencies import *
from schemas.books import *
from schemas.authors import Author
from utils.enums import Status
from utils.image import save_image
from sqlalchemy.exc import IntegrityError

router = APIRouter()

@router.post('/', status_code=201)
async def create_book(book_data: CreateBook,
                      book_service: BookService = Depends(get_book_service)):
    new_book = book_service.create_book(book_data)
    if not new_book:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return new_book

@router.get('/', status_code=200)
async def get_all_books(name: str | None = Query(None),
                        description: str | None = Query(None),
                        id_publisher: int | None = Query(None),
                        year: int | None = Query(None),
                        ISBN: str | None = Query(None),
                        id_genre: int | None = Query(None),
                        id_author: int | None = Query(None),
                        book_service: BookService = Depends(get_book_service),
                        publisher_service: PublisherService = Depends(get_publisher_service),
                        author_service: AuthorService = Depends(get_author_service)):
    filter = {k: v for k, v in locals().items() if v is not None 
          and k not in {"book_service", "publisher_service", "author_service", "id_genre", "id_author"}}

    books = book_service.get_all_books_filter_by(id_author=id_author, id_genre=id_genre, **filter)
    response = []
    for book in books:
        publisher = publisher_service.get_one_publisher_filter_by(id=book.id_publisher)

        authors = author_service.get_all_authors_filter_by(id_book=book.id)
        authors_list = [Author(**author.__dict__) for author in authors]

        genres = book_service.get_all_genres_filter_by(id_book=book.id)
        genres_list = [Genre(**genre.__dict__) for genre in genres]

        book_data = book.__dict__
        book_data.update({
            'authors': authors_list,
            'publisher': publisher.__dict__,
            'genres': genres_list,
        })
        response.append(Book(**book_data))
    return response

@router.get('/{id}', status_code=200)
async def get_book(id: int, book_service: BookService = Depends(get_book_service),
                   publisher_service: PublisherService = Depends(get_publisher_service),
                   author_service: AuthorService = Depends(get_author_service)):
    book = book_service.get_one_book_filter_by(id=id)
    if not book:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    publisher = publisher_service.get_one_publisher_filter_by(id=book.id_publisher)

    authors = author_service.get_all_authors_filter_by(id_book=book.id)
    authors_list = [Author(**author.__dict__) for author in authors]

    genres = book_service.get_all_genres_filter_by(id_book=book.id)
    genres_list = [Genre(**genre.__dict__) for genre in genres]

    book_data = book.__dict__
    book_data.update({
        'authors': authors_list,
        'publisher': publisher.__dict__,
        'genres': genres_list,
    })
    book = Book(**book_data)
    return book

@router.put('/{id}', status_code=200)
async def update_book(id: int, 
                      update_data: UpdateBook,
                      book_service: BookService = Depends(get_book_service)):
    book = book_service.get_one_book_filter_by(id=id)
    if book is None:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    book_update = book_service.update_book(id, update_data)
    return book_update

@router.delete('/{id}', status_code=200)
async def delete_book(id: int, book_service: BookService = Depends(get_book_service)):
    book = book_service.get_one_book_filter_by(id=id)
    if book is None:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    try:
        book_service.delete_book(id=id)
        return {'status': Status.SUCCESS.value, 'message': f'Book with id {id} deleted successfully'}
    except IntegrityError as e:
        # Обработка ошибки внешнего ключа
        raise HTTPException(
            status_code=400,
            detail={
                'status': Status.FAILED.value,
                'message': f'Cannot delete book with id {id} because it is referenced in other records (e.g., orders).'
            }
        )

@router.patch('/{id}/image', status_code=200)
async def update_book_image(id: int, image: UploadFile = File(...),
                            book_service: BookService = Depends(get_book_service)):
    book = book_service.get_one_book_filter_by(id=id)
    if not book:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    upd_book = book_service.update_book(id, UpdateBook(image=image.filename))
    image_name = save_image(image)
    return {'status': Status.SUCCESS.value, 'update_image': image_name}