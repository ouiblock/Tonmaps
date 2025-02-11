from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.models import Booking, Ride, User
from ..schemas.schemas import BookingCreate, Booking as BookingSchema, BookingUpdate
from ..utils.auth import get_current_user
from ..utils.ton import TONHelper

router = APIRouter(prefix="/bookings", tags=["Bookings"])
ton_helper = TONHelper()

@router.post("/", response_model=BookingSchema)
async def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if ride exists and has enough seats
    ride = db.query(Ride).filter(Ride.id == booking.ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    if ride.available_seats < booking.seats_booked:
        raise HTTPException(status_code=400, detail="Not enough seats available")
    
    # Create booking
    db_booking = Booking(
        ride_id=booking.ride_id,
        passenger_id=current_user.id,
        seats_booked=booking.seats_booked,
        status="pending",
        payment_status="pending"
    )
    
    # Update available seats
    ride.available_seats -= booking.seats_booked
    
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    
    # Generate deposit address for payment
    deposit_address = ton_helper.get_deposit_address(db_booking.id)
    
    return {
        **db_booking.__dict__,
        "deposit_address": deposit_address,
        "amount_to_pay": ride.price_per_seat * booking.seats_booked
    }

@router.get("/", response_model=List[BookingSchema])
async def list_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bookings = db.query(Booking)\
        .filter(Booking.passenger_id == current_user.id)\
        .order_by(Booking.created_at.desc())\
        .all()
    return bookings

@router.get("/{booking_id}", response_model=BookingSchema)
async def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Check if user is either the passenger or the driver
    if booking.passenger_id != current_user.id and booking.ride.driver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this booking")
    
    return booking

@router.patch("/{booking_id}", response_model=BookingSchema)
async def update_booking_status(
    booking_id: int,
    booking_update: BookingUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Only the driver can update the booking status
    if booking.ride.driver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the driver can update booking status")
    
    # Update booking status
    for field, value in booking_update.dict(exclude_unset=True).items():
        setattr(booking, field, value)
    
    # If status is changed to "cancelled", return seats to the ride
    if booking_update.status == "cancelled":
        booking.ride.available_seats += booking.seats_booked
    
    db.commit()
    db.refresh(booking)
    return booking

@router.post("/{booking_id}/verify-payment")
async def verify_payment(
    booking_id: int,
    tx_hash: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Verify the transaction
    try:
        tx_status = await ton_helper.verify_transaction(tx_hash)
        if tx_status["status"] == "success":
            booking.payment_status = "paid"
            booking.status = "confirmed"
            db.commit()
            return {"message": "Payment verified successfully"}
        else:
            raise HTTPException(status_code=400, detail="Payment verification failed")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
