from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from models import *
from crud import *
from config.database import get_session
from config.auth import oauth2_scheme
from utils.enums import Roles, AuthStatus
from service import *

# User and Auth
def get_user_repository(db: Session = Depends(get_session)):
    return UserRepository(model=User, session=db)

def get_school_class_repository(db: Session = Depends(get_session)):
    return UserRepository(model=User, session=db)

def get_auth_service(user_repository: UserRepository = Depends(get_user_repository)) -> AuthService:
    return AuthService(user_repository=user_repository)

def get_current_user(token: str=Depends(oauth2_scheme), user_repository: UserRepository = Depends(get_user_repository)) -> User:
    service = AuthService(user_repository=user_repository)
    return service.get_user_by_token(token)

def get_current_admin(token: str=Depends(oauth2_scheme), user_repository: UserRepository = Depends(get_user_repository)) -> User:
    service = AuthService(user_repository=user_repository)
    user = service.get_user_by_token(token)
    if user.role != Roles.ADMIN.value:
        raise HTTPException(status_code=403, detail={'status': AuthStatus.FORBIDDEN.value})
    return user

def get_user_service(user_repository: UserRepository = Depends(get_user_repository),
                     school_class_repository: UserRepository = Depends(get_school_class_repository)) -> UserService:
    return UserService(user_repository=user_repository,
                       school_class_repository=school_class_repository)


# Associations
def get_book_genre_assoc_repository(db: Session = Depends(get_session)):
    return BookRepository(model=GenreBook, session=db)

def get_author_assoc_repository(db: Session = Depends(get_session)):
    return BookRepository(model=AuthorBook, session=db)


# Book
def get_book_repository(db: Session = Depends(get_session)):
    return BookRepository(model=Book, session=db)

def get_book_item_repository(db: Session = Depends(get_session)):
    return BookRepository(model=BookItem, session=db)

def get_book_genre_repository(db: Session = Depends(get_session)):
    return BookRepository(model=Genre, session=db)

def get_book_service(book_repository: BookRepository = Depends(get_book_repository),
                     book_item_repository: BookRepository = Depends(get_book_item_repository),
                     book_genre_repository: BookRepository = Depends(get_book_genre_repository),
                     book_genre_assoc_repository: BookRepository = Depends(get_book_genre_assoc_repository),
                     book_author_assoc_repository: BookRepository = Depends(get_author_assoc_repository)):
    return BookService(book_repository=book_repository,
                       book_item_repository=book_item_repository,
                       book_genre_repository=book_genre_repository,
                       book_genre_assoc_repository=book_genre_assoc_repository,
                       book_author_assoc_repository=book_author_assoc_repository)


# Author
def get_author_repository(db: Session = Depends(get_session)):
    return AuthorRepository(model=Author, session=db)

def get_author_service(author_repository: AuthorRepository = Depends(get_author_repository),
                       book_author_assoc_repository: BookRepository = Depends(get_author_assoc_repository)):
    return AuthorService(author_repository=author_repository,
                         book_author_assoc_repository=book_author_assoc_repository)


# Publisher
def get_publisher_repository(db: Session = Depends(get_session)):
    return PublisherRepository(model=Publisher, session=db)

def get_publisher_service(publisher_repository: PublisherRepository = Depends(get_publisher_repository)):
    return PublisherService(publisher_repository = publisher_repository)