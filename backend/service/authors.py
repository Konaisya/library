from utils.abstract_repository import IREpository
from models.books import *
from models.authors import AuthorBook, Author
from dependencies import AuthorRepository, BookRepository
from utils.enums import Status

class AuthorService:
    def __init__(self, author_repository: AuthorRepository,
                 book_author_assoc_repository: BookRepository):
        self.author_repository = author_repository
        self.book_author_assoc_repository = book_author_assoc_repository

    def get_all_authors_filter_by(self, id_book: int = None, **filter):
        query = self.author_repository.session.query(Author)
        if id_book:
            query = query.join(AuthorBook).filter(AuthorBook.id_book == id_book)
        for attr, value in filter.items():
            query = query.filter(getattr(Author, attr) == value)
        authors = query.all()
        return authors
    
    def get_one_author_filter_by(self, **filter):
        return self.author_repository.get_one_filter_by(**filter)