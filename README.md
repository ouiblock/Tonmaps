# TONmaps - Decentralized Ridesharing Platform

TONmaps is a decentralized ridesharing platform built on the TON blockchain. It allows users to share rides, earn rewards, and participate in a community-driven transportation network.

## Features

- 🚗 Ride sharing and booking
- 💰 TON blockchain integration
- 🏆 User leaderboard and rewards
- 🗺️ Real-time map integration
- 📱 Responsive design

## Project Structure

```
tonmaps/
├── frontend/         # Next.js frontend application
├── backend/         # Backend API server
└── README.md        # This file
```

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Python 3.8+

## Getting Started

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3010`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend server:
```bash
python main.py
```

## Development

For testing purposes, you can set a wallet address in the browser console:
```javascript
window.setWalletAddress('YOUR_TEST_ADDRESS')
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
