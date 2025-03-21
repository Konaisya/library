from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import date

class Author(BaseModel):
    id: int
    name: str
    image: str
    birth_date: date
    death_date: Optional[date]
    bio: str

    def __init__(self, **data):
        super().__init__(**data)
        self.image = f"backend/images/{self.image}"

class CreateAuthor(BaseModel):
    name: str
    birth_date: date
    death_date: Optional[date]
    bio: str

class UpdateAuthor(BaseModel):
    name: Optional[str]
    image: Optional[str]
    birth_date: Optional[date]
    death_date: Optional[date]
    bio: Optional[str]

