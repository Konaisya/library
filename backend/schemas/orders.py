from pydantic import BaseModel, Field, field_validator
from datetime import date
from utils.enums import OrderStatus
from typing import Optional
from schemas.users import UserResponse
from schemas.books import BookOrder

class Order(BaseModel):
    id: int
    user: UserResponse
    book: BookOrder
    order_date: date
    checkout_date: Optional[date] = None
    due_date: date
    return_date: Optional[date] = None
    status: OrderStatus

class CreateOrder(BaseModel):
    id_book: int
    due_date: date

    @field_validator("due_date")
    def validate_due_date(cls, value):
        if value < date.today():
            raise ValueError("Begin date must be greater than or equal to the current date")
        return value

class UpdateOrder(BaseModel):
    id_user: Optional[int] = None
    id_book: Optional[int] = None
    order_date: Optional[date] = None
    checkout_date: Optional[date] = None
    due_date: Optional[date] = None
    return_date: Optional[date] = None
    status: Optional[OrderStatus] = None

    class Config:
        use_enum_values = True

