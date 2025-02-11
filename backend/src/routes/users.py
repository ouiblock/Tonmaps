from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.models import User, Review
from ..schemas.schemas import User as UserSchema, UserUpdate, Review as ReviewSchema, ReviewCreate
from ..utils.auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserSchema)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=UserSchema)
async def update_user_profile(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/{user_id}", response_model=UserSchema)
async def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/{user_id}/reviews", response_model=ReviewSchema)
async def create_review(
    user_id: int,
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if user is reviewing themselves
    if current_user.id == user_id:
        raise HTTPException(status_code=400, detail="Cannot review yourself")
    
    # Create review
    db_review = Review(
        reviewer_id=current_user.id,
        reviewed_id=user_id,
        rating=review.rating,
        comment=review.comment
    )
    db.add(db_review)
    
    # Update user's average rating
    user_reviews = db.query(Review).filter(Review.reviewed_id == user_id).all()
    total_rating = sum(r.rating for r in user_reviews) + review.rating
    user.rating = total_rating / (len(user_reviews) + 1)
    
    db.commit()
    db.refresh(db_review)
    return db_review

@router.get("/{user_id}/reviews", response_model=List[ReviewSchema])
async def get_user_reviews(
    user_id: int,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    reviews = db.query(Review)\
        .filter(Review.reviewed_id == user_id)\
        .order_by(Review.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    return reviews
