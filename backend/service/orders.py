from utils.abstract_repository import IREpository
from models.orders import Order
from dependencies import OrderRepository
from schemas.orders import CreateOrder, UpdateOrder
from utils.enums import Status

class OrderService:
    def __init__(self, order_repository: OrderRepository):
        self.order_repository = order_repository

    def get_all_orders_filter_by(self, **filter):
        return self.order_repository.get_all_filter_by(**filter)
    
    def get_one_order_filter_by(self, **filter):
        return self.order_repository.get_one_filter_by(**filter)

    def create_order(self, order_data: dict):
        order = self.order_repository.add(order_data)
        return order
    
    def update_order(self, id: int, upd_data: UpdateOrder):
        entity = upd_data.model_dump()
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        return self.order_repository.update(entity)
    
    def delete_order(self, id: int):
        return self.order_repository.delete(id=id)

