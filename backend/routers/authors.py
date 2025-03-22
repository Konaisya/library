from fastapi import APIRouter, Depends, HTTPException, Query
from dependencies import get_publisher_service, PublisherService
from schemas.publishers import *
from utils.enums import Status
from datetime import date
from dependencies import get_author_service, AuthorService
from schemas.authors import *

router = APIRouter()

@router.get('/', status_code=200)
async def get_all_authors(name: str | None = Query(None),
                          image: str | None = Query(None),
                          birth_date: date | None = Query(None),
                          death_date: date | None = Query(None),
                          bio: str | None = Query(None),
                          id_book: int | None = Query(None),
                          author_service: AuthorService = Depends(get_author_service)):
    filter = {k: v for k, v in locals().items() if v is not None and k != "author_service" and k != "id_book"}
    authors = author_service.get_all_authors_filter_by(id_book=id_book, **filter)
    response = [Author(**author.__dict__) for author in authors]
    return response

@router.get('/{author_id}', status_code=200)
async def get_author_by_id(author_id: int, author_service: AuthorService = Depends(get_author_service)):
    author = author_service.get_one_author_filter_by(id=author_id)
    if author is None:
        raise HTTPException(status_code=404, detail="Author not found")
    author.image = f"images/{author.image}"
    return Author(**author.__dict__)