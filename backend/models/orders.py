from config.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, ForeignKey, DATE, String
from datetime import date

class Order(Base):
    __tablename__ = 'orders'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_user: Mapped[int] = mapped_column(ForeignKey("users.id"))
    id_book: Mapped[int] = mapped_column(ForeignKey("books.id"))
    order_date: Mapped[date] = mapped_column(DATE) # Дата создания заказа
    checkout_date: Mapped[date] = mapped_column(DATE, nullable=True) # Дата выдачи
    due_date: Mapped[date] = mapped_column(DATE) # Дата обязательного возврата
    return_date: Mapped[date] = mapped_column(DATE, nullable=True) # Дата фактического возврата
    status: Mapped[str] = mapped_column(String(255)) 

    user: Mapped["User"] = relationship("User", back_populates="order")
    book: Mapped["Book"] = relationship("Book", back_populates="order")