from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import enum
from datetime import datetime

Base = declarative_base()

class UserRole(enum.Enum):
    DRIVER = "driver"
    PASSENGER = "passenger"
    BOTH = "both"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    phone_number = Column(String)
    telegram_id = Column(String, unique=True, nullable=True)
    wallet_address = Column(String, unique=True, nullable=True)
    role = Column(Enum(UserRole), default=UserRole.PASSENGER)
    rating = Column(Float, default=5.0)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    rides_as_driver = relationship("Ride", back_populates="driver")
    bookings = relationship("Booking", back_populates="passenger")
    reviews_given = relationship("Review", foreign_keys="Review.reviewer_id", back_populates="reviewer")
    reviews_received = relationship("Review", foreign_keys="Review.reviewed_id", back_populates="reviewed")

class Ride(Base):
    __tablename__ = "rides"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("users.id"))
    origin = Column(String)
    origin_lat = Column(Float)
    origin_lng = Column(Float)
    destination = Column(String)
    destination_lat = Column(Float)
    destination_lng = Column(Float)
    departure_time = Column(DateTime)
    available_seats = Column(Integer)
    price_per_seat = Column(Float)
    accepts_parcels = Column(Boolean, default=False)
    max_parcel_size = Column(String, nullable=True)  # Small, Medium, Large
    parcel_price = Column(Float, nullable=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    driver = relationship("User", back_populates="rides_as_driver")
    bookings = relationship("Booking", back_populates="ride")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    ride_id = Column(Integer, ForeignKey("rides.id"))
    passenger_id = Column(Integer, ForeignKey("users.id"))
    seats_booked = Column(Integer)
    status = Column(String)  # pending, confirmed, cancelled, completed
    payment_status = Column(String)  # pending, paid, refunded
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    ride = relationship("Ride", back_populates="bookings")
    passenger = relationship("User", back_populates="bookings")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    reviewed_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Float)
    comment = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    reviewer = relationship("User", foreign_keys=[reviewer_id], back_populates="reviews_given")
    reviewed = relationship("User", foreign_keys=[reviewed_id], back_populates="reviews_received")
