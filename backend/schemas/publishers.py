from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime

class Publisher(BaseModel):
    id: int
    name: str
    image: str
    description: str
    foundation_year: int

class CreatePublisher(BaseModel):
    name: str
    description: str
    foundation_year: int

    @field_validator('foundation_year')
    def validate_year(cls, value):
        current_year = datetime.now().year
        if not (1000 <= value <= current_year):
            raise ValueError(f'Year must be between 1000 and {current_year}')
        return value

class UpdatePublisher(BaseModel):
    name: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    foundation_year: Optional[int] = None

    @field_validator('foundation_year')
    def validate_year(cls, value):
        current_year = datetime.now().year
        if not (1000 <= value <= current_year):
            raise ValueError(f'Year must be between 1000 and {current_year}')
        return value