from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile
from dependencies import get_publisher_service, PublisherService
from schemas.publishers import *
from utils.enums import Status
from utils.image import save_image

router = APIRouter()

@router.post('/', status_code=201)
async def create_publisher(new_publisher_data: CreatePublisher,
                           publisher_service: PublisherService = Depends(get_publisher_service)):
    new_publisher = publisher_service.create_publisher(new_publisher_data)
    if not new_publisher:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return {'status': Status.SUCCESS.value, 'new_publisher': new_publisher.__dict__}

@router.get('/', status_code=200)
async def get_all_publishers(name: str | None = Query(None),
                             image: str | None = Query(None),
                             description: str | None = Query(None),
                             foundation_year: int | None = Query(None),
                             publisher_service: PublisherService = Depends(get_publisher_service)):
    filter = {k: v for k, v in locals().items() if v is not None and k != "publisher_service"}
    publishers = publisher_service.get_all_publisher_filter_by(**filter)
    response = [Publisher(**publisher.__dict__) for publisher in publishers]
    return response

@router.get('/{id}', status_code=200)
async def get_publisher(id: int, publisher_service: PublisherService = Depends(get_publisher_service)):
    publisher = publisher_service.get_one_publisher_filter_by(id=id)
    if not publisher:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    return {'status': Status.SUCCESS.value, 'new_publisher':Publisher(**publisher.__dict__)}

@router.put('/{id}', status_code=200)
async def update_publisher(id: int, upd_data: UpdatePublisher,
                           publisher_service: PublisherService = Depends(get_publisher_service)):
    publisher = publisher_service.get_one_publisher_filter_by(id=id)
    if not publisher:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    upd_publisher = publisher_service.update_publisher(id, upd_data)
    return {'status': Status.SUCCESS.value, 'update_publisher': upd_publisher}

@router.delete('/{id}', status_code=200)
async def delete_publisher(id: int, publisher_service: PublisherService = Depends(get_publisher_service)):
    publisher = publisher_service.get_one_publisher_filter_by(id=id)
    if not publisher:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    publisher_delete = publisher_service.delete_publisher(id)
    return {'status': Status.SUCCESS.value}

@router.patch('/{id}/image', status_code=200)
async def update_publisher_image(id: int, image: UploadFile = File(...),
                                 publisher_service: PublisherService = Depends(get_publisher_service)):
    publisher = publisher_service.get_one_publisher_filter_by(id=id)
    if not publisher:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    upd_publisher = publisher_service.update_publisher(id, UpdatePublisher(image=image.filename))
    image_name = save_image(image)
    return {'status': Status.SUCCESS.value, 'update_image': image_name}