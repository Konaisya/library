from utils.abstract_repository import IREpository
from models.books import *
from models.authors import *
from dependencies import BookRepository
from schemas.books import CreateBook, UpdateBook
from utils.enums import Status
from sqlalchemy.orm import joinedload

class BookService:
    def __init__(self, book_repository: BookRepository,
                 book_item_repository: BookRepository,
                 book_genre_repository: BookRepository,
                 book_genre_assoc_repository: BookRepository,
                 book_author_assoc_repository: BookRepository):
        self.book_repository = book_repository
        self.book_item_repository = book_item_repository
        self.book_genre_repository = book_genre_repository
        self.book_genre_assoc_repository = book_genre_assoc_repository
        self.book_author_assoc_repository = book_author_assoc_repository

    # Book
    def get_all_books_filter_by(self, id_author: int = None, id_genre: int = None, **filter):
        query = self.book_repository.session.query(Book).options(
            joinedload(Book.author_book),
            joinedload(Book.genre_book)
        )
        if id_author:
            query = query.join(AuthorBook, AuthorBook.id_book == Book.id).filter(AuthorBook.id_author == id_author)
        if id_genre:
            query = query.join(GenreBook, GenreBook.id_book == Book.id).filter(GenreBook.id_genre == id_genre)
        books = query.filter_by(**filter).all()
        return books
    
    def get_one_book_filter_by(self, **filter):
        return self.book_repository.get_one_filter_by(**filter)
    
    def create_book(self, create_data: CreateBook):
        new_book = self.book_repository.add(create_data.model_dump())
        if not new_book:
            return Status.FAILED.value
        
        for author_id in create_data.ids_author:
            assoc_data = {
                'id_book': new_book.id,
                'id_author': author_id
            }
            self.book_author_assoc_repository(assoc_data)

        for genre_id in create_data.ids_genre:
            assoc_data = {
                'id_book': new_book.id,
                'id_genre': genre_id
            }
            self.book_genre_assoc_repository.add(assoc_data)
        return new_book
    
    def update_book(self, id: int, data: UpdateBook):
        entity = data.model_dump()
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        upd_book = self.book_repository.update(entity)
        return upd_book
    
    def delete_book(self, id: int):
        return self.book_repository.delete(id)
    

    # BookItem
    def get_all_book_items_filter_by(self, **filter):
        return self.book_item_repository.get_all_filter_by(**filter)
    
    def get_one_book_item_filter_by(self, **filter):
        return self.book_item_repository.get_one_filter_by(**filter)
    

    # Genre
    def get_all_genres_filter_by(self, id_book: int, **filter):
        query = self.book_genre_repository.session.query(Genre)
        if id_book:
            query = query.join(GenreBook).filter(GenreBook.id_book == id_book)
        for attr, value in filter.items():
            query = query.filter(getattr(Author, attr) == value)
        genres = query.all()
        return genres
    
    def get_one_genres_filter_by(self, **filter):
        return self.book_genre_repository.get_one_filter_by(**filter)
    
    
    
    