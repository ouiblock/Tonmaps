from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

class UserRole(str, Enum):
    DRIVER = "driver"
    PASSENGER = "passenger"
    BOTH = "both"

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    phone_number: str
    role: UserRole = UserRole.PASSENGER

class UserCreate(UserBase):
    password: str
    telegram_id: Optional[str] = None
    wallet_address: Optional[str] = None

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    telegram_id: Optional[str] = None
    wallet_address: Optional[str] = None
    role: Optional[UserRole] = None

class User(UserBase):
    id: int
    rating: float
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

class RideBase(BaseModel):
    origin: str
    origin_lat: float
    origin_lng: float
    destination: str
    destination_lat: float
    destination_lng: float
    departure_time: datetime
    available_seats: int
    price_per_seat: float
    accepts_parcels: bool = False
    max_parcel_size: Optional[str] = None
    parcel_price: Optional[float] = None
    description: Optional[str] = None

class RideCreate(RideBase):
    pass

class RideUpdate(BaseModel):
    available_seats: Optional[int] = None
    price_per_seat: Optional[float] = None
    accepts_parcels: Optional[bool] = None
    max_parcel_size: Optional[str] = None
    parcel_price: Optional[float] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class Ride(RideBase):
    id: int
    driver_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    driver: User

    class Config:
        from_attributes = True

class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    REFUNDED = "refunded"

class BookingBase(BaseModel):
    ride_id: int
    seats_booked: int

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    payment_status: Optional[PaymentStatus] = None

class Booking(BookingBase):
    id: int
    passenger_id: int
    status: BookingStatus
    payment_status: PaymentStatus
    created_at: datetime
    ride: Ride
    passenger: User

    class Config:
        from_attributes = True

class ReviewBase(BaseModel):
    reviewed_id: int
    rating: float = Field(ge=1, le=5)
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: int
    reviewer_id: int
    created_at: datetime
    reviewer: User
    reviewed: User

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
