from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile
from dependencies import *
from schemas.users import *
from utils.enums import Status

router = APIRouter()

@router.post('/', status_code=201)
async def create_school_class(school_class_data: CreateSchoolClass,
                              user_service: UserService = Depends(get_user_service)):
    new_school_class = user_service.create_school_class(school_class_data)
    if new_school_class == Status.FAILED.value:
        raise HTTPException(status_code=400, detail={'staus': Status.FAILED.value})
    return {'status': Status.SUCCESS.value, 'school_class': new_school_class}

@router.get('/', status_code=200)
async def get_all_school_classes_filter_by(name: str | None = Query(None),
                                          user_service: UserService = Depends(get_user_service)):
    filter = {k: v for k, v in locals().items() if v is not None and k != "user_service"}
    school_classes = user_service.get_all_school_classes_filter_by(**filter)
    response = [SchoolClass(**school_class.__dict__) for school_class in school_classes]
    return response

@router.get('/{id}', status_code=200)
async def get_school_class(id: int, user_service: UserService = Depends(get_user_service)):
    school_class = user_service.get_one_school_class_filter_by(id=id)
    if school_class is None:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    return SchoolClass(**school_class.__dict__)

@router.put('/{id}', status_code=200)
async def update_school_class(id: int, 
                       update_data: UpdateSchoolClass,
                       user_service: UserService = Depends(get_user_service)):
    school_class = user_service.get_one_school_class_filter_by(id=id)
    if school_class is None:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    school_class_update = user_service.update_school_class(id, update_data)
    return school_class_update

@router.delete('/{id}', status_code=200)
async def delete_school_class(id: int, user_service: UserService = Depends(get_user_service)):
    school_class = user_service.get_one_school_class_filter_by(id=id)
    if school_class is None:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    school_class_delete = user_service.delete_school_class(id)
    return {'status': Status.SUCCESS.value}