from pydantic import BaseModel, Field, field_validator, EmailStr
import re
from typing import Optional

class SchoolClass(BaseModel):
    id: int
    name: str

class CreateSchoolClass(BaseModel):
    name: str
    
class UpdateSchoolClass(BaseModel):
    name: str


class UserCreate(BaseModel):
    name: Optional[str] = None
    id_school_class: Optional[int] = None
    role: Optional[str] = None
    email: EmailStr
    password: str

    @field_validator('email')
    @classmethod
    def validate_email(cls, val: str):
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', val):
            raise ValueError('Invalid email address')
        return val

    @field_validator('password')
    @classmethod
    def validate_password(cls, val: str):
        if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$', val):
            raise ValueError('Invalid password')
        return val 
    
class UserUpdate(BaseModel):
    name: Optional[str] = None
    id_school_class: Optional[int] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

    @field_validator('email')
    @classmethod
    def validate_email(cls, val: str):
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', val):
            raise ValueError('Invalid email address')
        return val

    @field_validator('password')
    @classmethod
    def validate_password(cls, val: str):
        if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$', val):
            raise ValueError('Invalid password')
        return val
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, val: str):
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', val):
            raise ValueError('Invalid email address')
        return val

    @field_validator('password')
    @classmethod
    def validate_password(cls, val: str):
        if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$', val):
            raise ValueError('Invalid password')
        return val
    
class User(BaseModel):
    id: int
    name: str
    school_class: Optional[SchoolClass] = None 
    role: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    school_class: Optional[SchoolClass] = None 
    email: str