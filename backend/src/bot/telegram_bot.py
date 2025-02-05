from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    MessageHandler,
    filters,
    ContextTypes,
    ConversationHandler,
)
import os
from dotenv import load_dotenv
import json
import httpx
from datetime import datetime

load_dotenv()

# States for conversation handler
CHOOSING_ACTION, CREATING_RIDE, SEARCHING_RIDES, BOOKING_RIDE = range(4)

# API URL
API_URL = "http://localhost:8000"

class TelegramBot:
    def __init__(self):
        self.token = os.getenv("TELEGRAM_BOT_TOKEN")
        
    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        keyboard = [
            [
                InlineKeyboardButton("Offer a Ride 🚗", callback_data="create_ride"),
                InlineKeyboardButton("Find a Ride 🔍", callback_data="search_rides"),
            ],
            [
                InlineKeyboardButton("My Rides 📋", callback_data="my_rides"),
                InlineKeyboardButton("Profile 👤", callback_data="profile"),
            ],
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await update.message.reply_text(
            "Welcome to TON Carpool! 🚗\n\n"
            "I can help you find or offer rides. What would you like to do?",
            reply_markup=reply_markup
        )
        return CHOOSING_ACTION

    async def create_ride(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        query = update.callback_query
        await query.answer()
        
        context.user_data["creating_ride"] = {}
        await query.edit_message_text(
            "Let's create a ride! 🚗\n\n"
            "Please enter your departure location in this format:\n"
            "Origin: [City]"
        )
        return CREATING_RIDE

    async def handle_ride_creation(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        text = update.message.text
        ride_data = context.user_data.get("creating_ride", {})
        
        if text.startswith("Origin:"):
            ride_data["origin"] = text.replace("Origin:", "").strip()
            await update.message.reply_text(
                "Great! Now enter your destination in this format:\n"
                "Destination: [City]"
            )
        elif text.startswith("Destination:"):
            ride_data["destination"] = text.replace("Destination:", "").strip()
            await update.message.reply_text(
                "When are you departing? Please use this format:\n"
                "Time: YYYY-MM-DD HH:MM"
            )
        elif text.startswith("Time:"):
            try:
                ride_data["departure_time"] = datetime.strptime(
                    text.replace("Time:", "").strip(),
                    "%Y-%m-%d %H:%M"
                ).isoformat()
                await update.message.reply_text(
                    "How many seats are available?\n"
                    "Seats: [number]"
                )
            except ValueError:
                await update.message.reply_text("Invalid date format. Please use: YYYY-MM-DD HH:MM")
        elif text.startswith("Seats:"):
            try:
                ride_data["available_seats"] = int(text.replace("Seats:", "").strip())
                await update.message.reply_text(
                    "What's the price per seat in TON?\n"
                    "Price: [number]"
                )
            except ValueError:
                await update.message.reply_text("Please enter a valid number of seats.")
        elif text.startswith("Price:"):
            try:
                ride_data["price_per_seat"] = float(text.replace("Price:", "").strip())
                
                # Create ride through API
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        f"{API_URL}/rides/",
                        json=ride_data,
                        headers={"Authorization": f"Bearer {context.user_data.get('token')}"}
                    )
                    
                    if response.status_code == 200:
                        ride = response.json()
                        await update.message.reply_text(
                            "✅ Ride created successfully!\n\n"
                            f"From: {ride['origin']}\n"
                            f"To: {ride['destination']}\n"
                            f"When: {ride['departure_time']}\n"
                            f"Seats: {ride['available_seats']}\n"
                            f"Price: {ride['price_per_seat']} TON"
                        )
                        return CHOOSING_ACTION
                    else:
                        await update.message.reply_text(
                            "❌ Failed to create ride. Please try again."
                        )
            except ValueError:
                await update.message.reply_text("Please enter a valid price.")
        
        context.user_data["creating_ride"] = ride_data
        return CREATING_RIDE

    async def search_rides(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        query = update.callback_query
        await query.answer()
        
        await query.edit_message_text(
            "Where are you traveling from?\n"
            "Please enter: From: [City]"
        )
        return SEARCHING_RIDES

    async def handle_ride_search(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        text = update.message.text
        search_data = context.user_data.get("searching_rides", {})
        
        if text.startswith("From:"):
            search_data["origin"] = text.replace("From:", "").strip()
            await update.message.reply_text(
                "Where do you want to go?\n"
                "Please enter: To: [City]"
            )
        elif text.startswith("To:"):
            search_data["destination"] = text.replace("To:", "").strip()
            
            # Search rides through API
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{API_URL}/rides/",
                    params=search_data
                )
                
                if response.status_code == 200:
                    rides = response.json()
                    if not rides:
                        await update.message.reply_text("No rides found for your route. 😕")
                        return CHOOSING_ACTION
                    
                    for ride in rides[:5]:  # Show first 5 rides
                        keyboard = [[
                            InlineKeyboardButton(
                                "Book this ride 🎟",
                                callback_data=f"book_ride_{ride['id']}"
                            )
                        ]]
                        reply_markup = InlineKeyboardMarkup(keyboard)
                        
                        await update.message.reply_text(
                            f"🚗 Ride from {ride['origin']} to {ride['destination']}\n"
                            f"📅 {ride['departure_time']}\n"
                            f"💺 {ride['available_seats']} seats available\n"
                            f"💰 {ride['price_per_seat']} TON per seat",
                            reply_markup=reply_markup
                        )
                    return CHOOSING_ACTION
                else:
                    await update.message.reply_text(
                        "❌ Failed to search rides. Please try again."
                    )
        
        context.user_data["searching_rides"] = search_data
        return SEARCHING_RIDES

    async def book_ride(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        query = update.callback_query
        await query.answer()
        
        ride_id = query.data.replace("book_ride_", "")
        
        # Book ride through API
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{API_URL}/bookings/",
                json={"ride_id": int(ride_id), "seats_booked": 1},
                headers={"Authorization": f"Bearer {context.user_data.get('token')}"}
            )
            
            if response.status_code == 200:
                booking = response.json()
                await query.edit_message_text(
                    "✅ Ride booked successfully!\n\n"
                    f"Booking ID: {booking['id']}\n"
                    f"Please send {booking['amount_to_pay']} TON to:\n"
                    f"`{booking['deposit_address']}`\n\n"
                    "After payment, the driver will be notified and confirm your booking."
                )
            else:
                await query.edit_message_text(
                    "❌ Failed to book ride. Please try again."
                )
        return CHOOSING_ACTION

    def run(self):
        application = Application.builder().token(self.token).build()
        
        # Create conversation handler
        conv_handler = ConversationHandler(
            entry_points=[CommandHandler("start", self.start)],
            states={
                CHOOSING_ACTION: [
                    CallbackQueryHandler(self.create_ride, pattern="^create_ride$"),
                    CallbackQueryHandler(self.search_rides, pattern="^search_rides$"),
                    CallbackQueryHandler(self.book_ride, pattern="^book_ride_"),
                ],
                CREATING_RIDE: [
                    MessageHandler(filters.TEXT & ~filters.COMMAND, self.handle_ride_creation)
                ],
                SEARCHING_RIDES: [
                    MessageHandler(filters.TEXT & ~filters.COMMAND, self.handle_ride_search)
                ],
            },
            fallbacks=[CommandHandler("start", self.start)],
        )
        
        application.add_handler(conv_handler)
        application.run_polling()
