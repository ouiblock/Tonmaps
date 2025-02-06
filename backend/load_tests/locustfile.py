from locust import HttpUser, task, between

class TonMapsUser(HttpUser):
    wait_time = between(1, 5)  # Wait between 1-5 seconds between tasks

    def on_start(self):
        """Initialize user data on start."""
        self.token = None
        self.login()

    def login(self):
        """Simulate user login."""
        response = self.client.post("/api/auth/login", json={
            "wallet_address": "test_wallet"
        })
        if response.status_code == 200:
            self.token = response.json().get("token")

    @task(3)
    def view_rides(self):
        """View available rides."""
        self.client.get("/api/rides", 
            headers={"Authorization": f"Bearer {self.token}"})

    @task(2)
    def search_rides(self):
        """Search for rides."""
        self.client.get("/api/rides/search", 
            params={"from": "location1", "to": "location2"},
            headers={"Authorization": f"Bearer {self.token}"})

    @task(1)
    def create_ride(self):
        """Create a new ride."""
        self.client.post("/api/rides", json={
            "from": "location1",
            "to": "location2",
            "price": "10.5",
            "seats": 2
        }, headers={"Authorization": f"Bearer {self.token}"})

    @task(2)
    def view_profile(self):
        """View user profile."""
        self.client.get("/api/profile",
            headers={"Authorization": f"Bearer {self.token}"})

    @task(1)
    def update_profile(self):
        """Update user profile."""
        self.client.put("/api/profile", json={
            "name": "Test User",
            "preferences": {"theme": "dark"}
        }, headers={"Authorization": f"Bearer {self.token}"})
