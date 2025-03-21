from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
from schemas.authors import Author
from schemas.publishers import Publisher

class Genre(BaseModel):
    id: int
    name: str

class CreateGenre(BaseModel):
    name: str

class UpdateGenre(BaseModel):
    name: str


class CreateBook(BaseModel):
    name: str
    description: str
    image: str
    ids_author: List[int]
    ids_genre: List[int]
    id_publisher: int
    year: int
    ISBN: str

    @field_validator('year')
    def validate_year(cls, value):
        current_year = datetime.now().year
        if not (1000 <= value <= current_year):
            raise ValueError(f'Year must be between 1000 and {current_year}')
        return value

class UpdateBook(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    ids_author: Optional[List[int]] = None
    ids_genre: Optional[List[int]] = None
    id_publisher: Optional[int] = None
    year: Optional[int] = None
    ISBN: Optional[str] = None

    @field_validator('year')
    def validate_year(cls, value):
        current_year = datetime.now().year
        if not (1000 <= value <= current_year):
            raise ValueError(f'Year must be between 1000 and {current_year}')
        return value

class Book(BaseModel):
    id: int
    name: str
    description: str
    image: str
    authors: List[Author]
    genres: List[Genre]
    publisher: Publisher
    year: int
    ISBN: str
    quantity: int

    def __init__(self, **data):
        super().__init__(**data)
        self.image = f"backend/images/{self.image}"


class CreateBookItem(BaseModel):
    id_book: int
    is_availible: bool

class UpdateBookItem(BaseModel):
    id_book: Optional[int]
    is_availible: Optional[bool]

class BookItem(BaseModel):
    id: int
    book: Book
    is_availible: int