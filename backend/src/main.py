from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from .models import models
from .routes import auth, users, rides, bookings

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="TON Carpool API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(rides.router)
app.include_router(bookings.router)

@app.get("/")
async def root():
    return {"message": "Welcome to TON Carpool API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
