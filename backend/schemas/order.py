from pydantic import BaseModel, Field, field_validator
from datetime import date
from utils.enums import OrderStatus
from typing import Optional
from schemas.users import User
from schemas.books import BookItem

class Order(BaseModel):
    id: int
    user: User
    book_item: BookItem
    checkout_date: date
    due_date: date
    return_date: Optional[date]
    status: OrderStatus

class CreateOrder(BaseModel):
    id: int
    id_user: int
    id_book_item: int
    checkout_date: date
    due_date: date
    return_date: Optional[date]
    status: OrderStatus

    @field_validator("checkout_date")
    def validate_begin_date(cls, value):
        if date.strptime(value, "%Y-%m-%d").date() < date.now().date():
            raise ValueError("Begin date must be greater than or equal to the current date")
        return value

class UpdateOrder(BaseModel):
    id: Optional[int]
    id_user: Optional[int]
    id_book_item: Optional[int]
    checkout_date: Optional[date]
    due_date: Optional[date]
    return_date: Optional[date]
    status: Optional[str]

    @field_validator("checkout_date")
    def validate_begin_date(cls, value):
        if date.strptime(value, "%Y-%m-%d").date() < date.now().date():
            raise ValueError("Begin date must be greater than or equal to the current date")
        return value
