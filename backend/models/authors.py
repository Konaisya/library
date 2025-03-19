from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey, TEXT, DATE
from datetime import date

class Author(Base):
    __tablename__ = 'authors'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    image: Mapped[str] = mapped_column(String(255), default='placeholder.png')
    birth_date: Mapped[date] = mapped_column(DATE)
    death_date: Mapped[date] = mapped_column(DATE, nullable=True)
    bio: Mapped[str] = mapped_column(TEXT)

    author_book: Mapped["AuthorBook"] = relationship("AuthorBook", back_populates="author")

class AuthorBook(Base):
    __tablename__ = 'author_books'

    id_author: Mapped[int] = mapped_column(ForeignKey('authors.id'), primary_key=True)
    id_book: Mapped[int] = mapped_column(ForeignKey('books.id'), primary_key=True)

    book: Mapped["Book"] = relationship("Book", back_populates="author_book")
    author: Mapped["Author"] = relationship("Author", back_populates="author_book")

