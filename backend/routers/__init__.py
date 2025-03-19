from routers.auth import router as auth_router
from routers.users import router as user_router
from routers.publishers import router as publisher_router
from routers.authors import router as author_router
from routers.books import router as book_routert

from fastapi import APIRouter

routers = APIRouter(prefix='/api')
routers.include_router(auth_router, prefix='/auth', tags=['auth'])
routers.include_router(user_router, prefix='/users', tags=['users'])
routers.include_router(publisher_router, prefix='/publishers', tags=['publishers'])
routers.include_router(author_router, prefix='/authors', tags=['authors'])
routers.include_router(book_routert, prefix='/books', tags=['books'])