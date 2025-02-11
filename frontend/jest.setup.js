// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock the Google Maps JavaScript API
const mockGeocoder = {
  geocode: jest.fn()
}

const mockMap = {
  setCenter: jest.fn(),
  setZoom: jest.fn(),
  fitBounds: jest.fn(),
}

const mockMarker = {
  setPosition: jest.fn(),
  setMap: jest.fn(),
}

const mockDirectionsService = {
  route: jest.fn()
}

const mockDirectionsRenderer = {
  setDirections: jest.fn(),
  setMap: jest.fn(),
}

window.google = {
  maps: {
    Geocoder: jest.fn(() => mockGeocoder),
    Map: jest.fn(() => mockMap),
    Marker: jest.fn(() => mockMarker),
    DirectionsService: jest.fn(() => mockDirectionsService),
    DirectionsRenderer: jest.fn(() => mockDirectionsRenderer),
    LatLng: jest.fn((lat, lng) => ({ lat, lng })),
    LatLngBounds: jest.fn(() => ({
      extend: jest.fn(),
    })),
  },
}

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    }
  },
}))

// Mock TON Connect
jest.mock('@tonconnect/sdk', () => ({
  TonConnect: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    getWallets: jest.fn(),
  })),
}))

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks()
})
