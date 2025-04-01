from fastapi import APIRouter, Depends, HTTPException, Query
from dependencies import *
from schemas.orders import *
from schemas.users import UserResponse
from schemas.books import BookOrder, UpdateBook
from utils.enums import OrderStatus, Status, Roles
from datetime import datetime

router = APIRouter()

@router.post('/', status_code=201)
async def create_order(order_data: CreateOrder,
                       order_service: OrderService = Depends(get_order_service),
                       ):
    order_dict = order_data.dict()
    order_dict['id_user'] = 1
    order_dict['order_date'] = datetime.now().strftime('%Y-%m-%d')
    order_dict['status'] = OrderStatus.PROCESSING.value
    order = order_service.create_order(order_dict)
    if not order:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return order

@router.get('/', status_code=200)
async def get_all_orders(id_user: int | None = Query(None),
                         id_book: int | None = Query(None),
                         status: OrderStatus | None = Query(None),
                         order_service: OrderService = Depends(get_order_service),
                         user_service: UserService = Depends(get_user_service),
                         book_service: BookService = Depends(get_book_service),
                         user = Depends(get_current_user)):
    if user.role == Roles.ADMIN.value:
        filter = {k: v for k, v in locals().items() if v is not None 
                  and k not in {"order_service", "user_service", "book_service", "user"}}
    else:
        filter = {k: v for k, v in locals().items() if v is not None 
                  and k not in {"order_service", "user_service", "book_service", "user"}}
        filter['id_user'] = user.id
    orders = order_service.get_all_orders_filter_by(**filter)
    response = []
    for order in orders:
        user_order = user_service.get_user_filter_by(id=order.id_user)
        user_resp = UserResponse(**user_order.__dict__)

        book = book_service.get_one_book_filter_by(id=order.id_book)
        book_resp = BookOrder(**book.__dict__)

        order_resp = order.__dict__
        order_resp.update({
            'user': user_resp,
            'book': book_resp,
        })
        response.append(Order(**order_resp))
    return response

@router.get('/{id}', status_code=200)
async def get_order(id: int,
                    order_service: OrderService = Depends(get_order_service),
                    user_service: UserService = Depends(get_user_service),
                    book_service: BookService = Depends(get_book_service),
                    user = Depends(get_current_user)):
    order = order_service.get_one_order_filter_by(id=id)
    user_order = user_service.get_user_filter_by(id=order.id_user)
    user_resp = UserResponse(**user_order.__dict__)

    book = book_service.get_one_book_filter_by(id=order.id_book)
    book_resp = BookOrder(**book.__dict__)

    order_resp = order.__dict__
    order_resp.update({
        'user': user_resp,
        'book': book_resp,
    })
    return Order(**order_resp)

@router.put('/{id}', status_code=200)
async def update_order(id: int,
                       update_data: UpdateOrder,
                       order_service: OrderService = Depends(get_order_service),
                       book_service: BookService = Depends(get_book_service),
                       ):
    order = order_service.get_one_order_filter_by(id=id)
    if not order:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})

    if 'status' in update_data.dict(exclude_unset=True):
        book = book_service.get_one_book_filter_by(id=order.id_book)
        if not book:
            raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value, 'message': 'Book not found'})
        count = book.count
        new_status = update_data.status

        if new_status == OrderStatus.CHECKED_OUT.value or new_status == OrderStatus.LOST.value:
            if count <= 0:
                raise HTTPException(status_code=400, detail={'status': Status.FAILED.value, 'message': 'zero count of books'})
            count -= 1
            upd_book = book_service.update_book(id=book.id, data=UpdateBook(count=count))
            if new_status == OrderStatus.CHECKED_OUT.value:
                upd_data_dict = update_data.dict(exclude_unset=True)
                upd_data_dict["checkout_date"] = datetime.now().strftime('%Y-%m-%d')
                update_data = UpdateOrder(**upd_data_dict)

        elif new_status == OrderStatus.RETURNED.value or new_status == OrderStatus.CANCELLED.value:
            count += 1
            upd_book = book_service.update_book(id=book.id, data=UpdateBook(count=count))
            if new_status == OrderStatus.RETURNED.value:
                upd_data_dict = update_data.dict(exclude_unset=True)
                upd_data_dict["return_date"] = datetime.now().strftime('%Y-%m-%d')
                update_data = UpdateOrder(**upd_data_dict)

    order_update = order_service.update_order(id=id, upd_data=update_data)
    return order_update

@router.delete('/{id}', status_code=200)
async def delete_order(id: int, 
                       order_service: OrderService = Depends(get_order_service),
                       user = Depends(get_current_admin)):
    order = order_service.get_one_order_filter_by(id=id)
    if not order:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    order_delete = order_service.delete_order(id=id)
    return {'status': Status.SUCCESS.value}