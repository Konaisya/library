from utils.abstract_repository import IREpository
from models.books import *
from dependencies import AuthorRepository
from schemas.books import *
from utils.enums import Status

class AuthorService:
    def __init__(self, author_repository: AuthorRepository,
                 author_assoc_repository: AuthorRepository):
        self.author_repository = author_repository
        self.author_assoc_repository = author_assoc_repository

    def get_all_authors_filter_by(self, **filter):
        return self.author_repository.get_all_filter_by(**filter)
    
    def get_one_author_filter_by(self, **filter):
        return self.author_repository.get_one_filter_by(**filter)
    
    