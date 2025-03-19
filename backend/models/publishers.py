from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, DATE, TEXT
from datetime import date

class Publisher(Base):
    __tablename__ = 'publishers'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    image: Mapped[str] = mapped_column(String(255), default='placeholder.png')
    description: Mapped[str] = mapped_column(TEXT)
    foundation_year: Mapped[int] = mapped_column(Integer)

    book: Mapped["Book"] = relationship("Book", back_populates="publisher")