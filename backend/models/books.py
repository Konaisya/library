from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey, TEXT, BOOLEAN

class Book(Base):
    __tablename__ = 'books'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(TEXT)
    image: Mapped[str] = mapped_column(String(255), default='placeholder.png')
    id_publisher: Mapped[int] = mapped_column(ForeignKey('publishers.id'))
    year: Mapped[int] = mapped_column(Integer)
    ISBN: Mapped[str] = mapped_column(String(255)) 

    genre_book: Mapped["GenreBook"] = relationship("GenreBook", back_populates="book")
    author_book: Mapped["AuthorBook"] = relationship("AuthorBook", back_populates="book")
    publisher: Mapped["Publisher"] = relationship("Publisher", back_populates="book")
    book_item: Mapped["BookItem"] = relationship("BookItem", back_populates="book")
    
class BookItem(Base):
    __tablename__ = 'book_items'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_book: Mapped[int] = mapped_column(ForeignKey('books.id'))
    is_available: Mapped[bool] = mapped_column(BOOLEAN, default=True)

    book: Mapped["Book"] = relationship("Book", back_populates="book_item")
    order: Mapped["Order"] = relationship("Order", back_populates="book_item")


class GenreBook(Base):
    __tablename__ = 'genre_books'

    id_genre: Mapped[int] = mapped_column(ForeignKey('genres.id'), primary_key=True)
    id_book: Mapped[int] = mapped_column(ForeignKey('books.id'), primary_key=True)

    book: Mapped["Book"] = relationship("Book", back_populates="genre_book")
    genre: Mapped["Genre"] = relationship("Genre", back_populates="genre_book")

class Genre(Base):
    __tablename__ = 'genres'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))

    genre_book: Mapped["GenreBook"] = relationship("GenreBook", back_populates="genre")

