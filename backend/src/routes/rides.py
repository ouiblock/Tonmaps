from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from ..database import get_db
from ..models.models import Ride, User, UserRole
from ..schemas.schemas import RideCreate, Ride as RideSchema, RideUpdate
from ..utils.auth import get_current_user
from pydantic import BaseModel
from typing import Optional

class Coordinate(BaseModel):
    lat: float
    lon: float

router = APIRouter(prefix="/rides", tags=["Rides"])

@router.post("/", response_model=RideSchema)
async def create_ride(
    ride: RideCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [UserRole.DRIVER, UserRole.BOTH]:
        raise HTTPException(status_code=403, detail="Only drivers can create rides")
    
    db_ride = Ride(
        **ride.dict(),
        driver_id=current_user.id,
        origin_coordinate=Coordinate(lat=ride.origin_coordinate.lat, lon=ride.origin_coordinate.lon),
        destination_coordinate=Coordinate(lat=ride.destination_coordinate.lat, lon=ride.destination_coordinate.lon)
    )
    db.add(db_ride)
    db.commit()
    db.refresh(db_ride)
    return db_ride

@router.get("/", response_model=List[RideSchema])
async def list_rides(
    origin: Optional[str] = None,
    destination: Optional[str] = None,
    date: Optional[datetime] = None,
    available_seats: Optional[int] = None,
    max_price: Optional[float] = None,
    accepts_parcels: Optional[bool] = None,
    max_parcel_size: Optional[str] = None,
    origin_coordinate: Optional[Coordinate] = None,
    destination_coordinate: Optional[Coordinate] = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Ride)
    
    if origin:
        query = query.filter(Ride.origin.ilike(f"%{origin}%"))
    if destination:
        query = query.filter(Ride.destination.ilike(f"%{destination}%"))
    if date:
        query = query.filter(Ride.departure_time >= date)
    if available_seats:
        query = query.filter(Ride.available_seats >= available_seats)
    if max_price:
        query = query.filter(Ride.price_per_seat <= max_price)
    if accepts_parcels is not None:
        query = query.filter(Ride.accepts_parcels == accepts_parcels)
    if max_parcel_size:
        query = query.filter(Ride.max_parcel_size == max_parcel_size)
    if origin_coordinate:
        query = query.filter(Ride.origin_coordinate.lat == origin_coordinate.lat, Ride.origin_coordinate.lon == origin_coordinate.lon)
    if destination_coordinate:
        query = query.filter(Ride.destination_coordinate.lat == destination_coordinate.lat, Ride.destination_coordinate.lon == destination_coordinate.lon)
    
    rides = query.order_by(Ride.departure_time).offset(skip).limit(limit).all()
    return rides

@router.get("/{ride_id}", response_model=RideSchema)
async def get_ride(ride_id: int, db: Session = Depends(get_db)):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    return ride

@router.patch("/{ride_id}", response_model=RideSchema)
async def update_ride(
    ride_id: int,
    ride_update: RideUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not db_ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    if db_ride.driver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the ride creator can update the ride")
    
    for field, value in ride_update.dict(exclude_unset=True).items():
        setattr(db_ride, field, value)
    
    db.commit()
    db.refresh(db_ride)
    return db_ride

@router.delete("/{ride_id}")
async def delete_ride(
    ride_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not db_ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    if db_ride.driver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the ride creator can delete the ride")
    
    db.delete(db_ride)
    db.commit()
    return {"message": "Ride deleted successfully"}
