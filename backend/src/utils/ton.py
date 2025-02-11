import os
from dotenv import load_dotenv

load_dotenv()

TON_NETWORK = os.getenv("TON_NETWORK", "testnet")

class TONHelper:
    def __init__(self):
        self.network = TON_NETWORK
    
    def create_wallet(self):
        """Create a new TON wallet"""
        # For demo purposes, return a mock wallet
        return {
            "mnemonics": ["word1", "word2", "word3"],
            "public_key": "mock_public_key",
            "wallet_address": "EQD4FPq3nBQtikBQNB8loZuFq3Ss-OFhcqVjyZyoXrYxeGiE"
        }
    
    async def get_balance(self, address: str) -> float:
        """Get wallet balance in TON"""
        # For demo purposes, return a mock balance
        return 100.0
    
    async def verify_transaction(self, tx_hash: str) -> dict:
        """Verify a transaction on TON blockchain"""
        # For demo purposes, always return success
        return {
            "status": "success",
            "details": {
                "hash": tx_hash,
                "amount": "1.5 TON",
                "timestamp": "2025-01-30T17:00:00Z"
            }
        }
    
    def get_deposit_address(self, booking_id: int) -> str:
        """Generate a deposit address for a booking"""
        # For demo purposes, return a mock address
        return "EQD4FPq3nBQtikBQNB8loZuFq3Ss-OFhcqVjyZyoXrYxeGiE"
