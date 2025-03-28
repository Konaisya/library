from utils.enums import Roles, AuthStatus
from fastapi import HTTPException
from passlib.hash import pbkdf2_sha256
from schemas.users import *
from crud.users import UserRepository
from utils.enums import Status

class UserService:
    def __init__(self, user_repository: UserRepository,
                 school_class_repository: UserRepository):
        self.school_class_repository = school_class_repository
        self.user_repository = user_repository

    def get_all_users_filter_by(self, **filter):
        users = self.user_repository.get_all_filter_by(**filter)
        return users

    def get_user_filter_by(self, **filter):
        user = self.user_repository.get_one_filter_by(**filter)
        return user

    def update(self, user_id: int, data: UserUpdate):
        entity = data.model_dump()
        user = self.user_repository.get_one_filter_by(id=user_id)
        if data.password and not pbkdf2_sha256.verify(data.password, user.password):
            raise HTTPException(status_code=403, detail={'status': AuthStatus.INVALID_PASSWORD.value})
        if data.password:
            entity['password'] = pbkdf2_sha256.hash(data.password)
        self.user_repository.update(user_id, entity)
        updated_user = self.user_repository.get_one_filter_by(id=user_id)
        return updated_user

    def delete_user(self, user_id: int):
        return self.user_repository.delete(user_id)
    

    #School Classes
    def get_all_school_classes_filter_by(self, **filter):
        return self.school_class_repository.get_all_filter_by(**filter)
    
    def get_one_school_class_filter_by(self, **filter):
        return self.school_class_repository.get_one_filter_by(**filter)
    
    def create_school_class(self, create_data: CreateSchoolClass):
        new_school_class = self.school_class_repository.add(create_data.model_dump())
        if not new_school_class:
            return Status.FAILED.value
        return new_school_class
        
    def update_school_class(self, id: int, data: UpdateSchoolClass):
        entity = data.model_dump()
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        upd_school_class = self.school_class_repository.update(entity)
        return upd_school_class
    
    def delete_school_class(self, id: int):
        return self.school_class_repository.delete(id)