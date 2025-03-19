from utils.abstract_repository import IREpository
from models.books import *
from dependencies import PublisherRepository
from schemas.publishers import *
from utils.enums import Status

class PublisherService:
    def __init__(self, publisher_repository: PublisherRepository):
        self.publisher_repository = publisher_repository

    def get_all_publisher_filter_by(self, **filter):
        return self.publisher_repository.get_all_filter_by(**filter)
    
    def get_one_publisher_filter_by(self, **filter):
        return self.publisher_repository.get_one_filter_by(**filter)

    def create_publisher(self, create_data: CreatePublisher):
        new_publisher = self.publisher_repository.add(create_data.model_dump())
        if not new_publisher:
            return Status.FAILED.value
        return new_publisher

    def update_publisher(self, id: int, data: UpdatePublisher):
        entity = data.model_dump()
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        upd_publisher = self.publisher_repository.update(entity)
        return upd_publisher
    
    def delete_publisher(self, id: int):
        return self.publisher_repository.delete(id)