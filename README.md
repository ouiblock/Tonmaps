# TonMaps

[![CI](https://github.com/ouiblock/Tonmaps/actions/workflows/ci.yml/badge.svg)](https://github.com/ouiblock/Tonmaps/actions/workflows/ci.yml)
[![GitHub license](https://img.shields.io/github/license/ouiblock/Tonmaps)](https://github.com/ouiblock/Tonmaps/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/ouiblock/Tonmaps)](https://github.com/ouiblock/Tonmaps/issues)
[![GitHub stars](https://img.shields.io/github/stars/ouiblock/Tonmaps)](https://github.com/ouiblock/Tonmaps/stargazers)
[![Maintainability](https://api.codeclimate.com/v1/badges/your-repo-id/maintainability)](https://codeclimate.com/github/ouiblock/Tonmaps)
[![Documentation](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://ouiblock.github.io/Tonmaps/)

A decentralized ride-sharing and delivery application built on TON Blockchain.

![TonMaps Logo](public/tonmaps-logo.png)

## Features

- 🚗 Ride-sharing with TON payments
- 📦 Delivery service
- 🎁 TMAP token loyalty program
- 💬 Telegram integration
- 💰 TMAP token cashback system
- 🌙 Dark mode support
- 🗺️ Google Maps integration
- 📱 Responsive design

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Blockchain**: TON
- **Maps**: Google Maps API
- **Authentication**: Telegram Login
- **State Management**: React Context
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 16+
- npm or yarn
- Telegram account
- TON Wallet
- Google Maps API key

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/tonmaps.git
   cd tonmaps
   ```

2. Install dependencies
   ```bash
   cd frontend
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   NEXT_PUBLIC_TON_CENTER_API_KEY=your_ton_center_api_key
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The application will be available at `http://localhost:3000`

## Configuration

### Google Maps Setup
1. Get an API key from [Google Cloud Console](https://console.cloud.google.com)
2. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API

### TON Wallet Setup
1. Install TON Wallet from [ton.org](https://ton.org)
2. Create a new wallet
3. Add funds for testing

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable React components
│   │   ├── layout/     # Layout components
│   │   ├── maps/       # Map-related components
│   │   └── profile/    # Profile components
│   ├── contexts/       # React contexts
│   ├── pages/          # Next.js pages
│   │   ├── rides/      # Ride-sharing features
│   │   ├── delivery/   # Delivery features
│   │   └── profile/    # User profile
│   ├── services/       # API services
│   ├── styles/         # CSS styles
│   └── utils/          # Utilities
```

## Key Features

### Ride-Sharing
- Real-time location tracking
- Fare estimation
- Driver-passenger matching
- In-app TON payments

### Delivery Service
- Package tracking
- Delivery scheduling
- Size and weight calculation
- Delivery cost estimation

### TMAP Token System
- 5% cashback in TMAP tokens
- Token-to-TON conversion
- Reward claiming system
- Leaderboard ranking

## Contributing

1. Fork the project
2. Create your feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add: some amazing feature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

### Commit Convention

- `Add:` New features
- `Fix:` Bug fixes
- `Docs:` Documentation changes
- `Style:` Code style changes (formatting, semicolons)
- `Refactor:` Code refactoring
- `Test:` Adding tests
- `Chore:` Maintenance tasks

## Environment Variables

```env
# Required
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=   # Google Maps API key
NEXT_PUBLIC_TON_CENTER_API_KEY=    # TON Center API key

# Optional
NEXT_PUBLIC_ENVIRONMENT=           # development/production
NEXT_PUBLIC_TMAP_CONTRACT=         # TMAP token contract address
```

## API Documentation

### Maps Service
- `searchPlaces`: Search for locations using Google Places
- `geocodeAddress`: Convert address to coordinates
- `calculateRoute`: Get route between two points

### Wallet Service
- `connectWallet`: Connect TON wallet
- `sendTransaction`: Send TON payment
- `claimRewards`: Claim TMAP rewards

## Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run test coverage
npm run test:coverage
```

## Deployment

1. Build the application
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server
   ```bash
   npm run start
   # or
   yarn start
   ```

## Security

- All API keys are stored in environment variables
- Wallet connections use secure protocols
- User data is encrypted
- Regular security audits
- No sensitive data in localStorage

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Oxmasteronchain - [@Oxmasteronchain](https://t.me/Oxmasteronchain)

Project Links:
- GitHub: [https://github.com/ouiblock/tonmaps](https://github.com/ouiblock/tonmaps)
- Personal GitHub: [https://github.com/Oxmasteronchain](https://github.com/Oxmasteronchain)

## Acknowledgments

- [TON Blockchain](https://ton.org)
- [Google Maps Platform](https://cloud.google.com/maps-platform)
- [Telegram](https://telegram.org)
