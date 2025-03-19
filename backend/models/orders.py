from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, ForeignKey, DATE, String
from datetime import date

class Order(Base):
    __tablename__ = 'orders'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_user: Mapped[int] = mapped_column(ForeignKey("users.id"))
    id_book_item: Mapped[int] = mapped_column(ForeignKey("book_items.id")) # Для админа и юзера (инфу о книге получаем через поле id_book в BookItems)
    checkout_date: Mapped[date] = mapped_column(DATE) # Дата выдачи
    due_date: Mapped[date] = mapped_column(DATE) # Дата обязательного возврата
    return_date: Mapped[date] = mapped_column(DATE, nullable=True) # Дата фактического возврата
    status: Mapped[str] = mapped_column(String(255)) 

    user: Mapped["User"] = relationship("User", back_populates="order")
    book_item: Mapped["BookItem"] = relationship("BookItem", back_populates="order")