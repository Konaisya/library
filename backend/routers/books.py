from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile
from dependencies import *
from schemas.books import *
from schemas.authors import Author
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
                                  book_service: BookService = Depends(get_book_service),
                                  publisher_service: PublisherService = Depends(get_publisher_service),
                                  author_service: AuthorService = Depends(get_author_service)):
    filter = {k: v for k, v in locals().items() if v is not None 
              and k != "book_service" and k != "publisher_service" and k != "author_service"
              and k != "id_genre" and k != "id_author"}
    books = book_service.get_all_books_filter_by(id_author=id_author, id_genre=id_genre, **filter)
    response = []
    for book in books:
        publisher = publisher_service.get_one_publisher_filter_by(id=book.id_publisher)

        authors = author_service.get_all_authors_filter_by(id_book=book.id)
        authors_list = [Author(**author.__dict__) for author in authors]

        genres = book_service.get_all_genres_filter_by(id_book=book.id)
        genres_list = [Genre(**genre.__dict__) for genre in genres]

        book_items = book_service.get_all_book_items_filter_by(id_book=book.id)
        quantity = sum(1 for item in book_items if item.is_available)

        book_data = book.__dict__
        book_data.update({
            'authors': authors_list,
            'publisher': publisher.__dict__,
            'genres': genres_list,
            'quantity': quantity,
        })
        response.append(Book(**book_data))
    return response

@router.get('/{id}', status_code=200)
async def get_book(id: int, book_service: BookService = Depends(get_book_service)):
    book = book_service.get_one_book_filter_by(id=id)
    if not book:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    return {'status': Status.SUCCESS.value, 'new_book': Book(**book.__dict__)}


