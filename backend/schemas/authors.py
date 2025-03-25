from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import date

class Author(BaseModel):
    id: int
    name: str
    image: str
    birth_date: date
    death_date: Optional[date] = None
    bio: str

class CreateAuthor(BaseModel):
    name: str
    birth_date: date
    death_date: Optional[date] = None
    bio: str

class UpdateAuthor(BaseModel):
    name: Optional[str] = None
    image: Optional[str] = None
    birth_date: Optional[date] = None
    death_date: Optional[date] = None
    bio: Optional[str] = None

