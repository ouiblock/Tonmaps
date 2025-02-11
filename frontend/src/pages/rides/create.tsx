import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useWallet } from '@/contexts/WalletContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import { ridesApi } from '@/services/api';
import { rideSchema } from '@/utils/validation';
import { toast } from 'react-hot-toast';
import { MapPinIcon } from '@heroicons/react/24/solid';

const CreateRidePage: NextPage = () => {
  const router = useRouter();
  const { address } = useWallet();
  const { location, getCoordsFromAddress } = useGeolocation();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    seats: 1,
    price: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      // Validate form data
      const validatedData = rideSchema.parse({
        ...formData,
        seats: Number(formData.seats),
        price: Number(formData.price),
      });

      // Get coordinates for locations
      const fromCoords = await getCoordsFromAddress(formData.from);
      const toCoords = await getCoordsFromAddress(formData.to);

      if (!fromCoords || !toCoords) {
        toast.error('Could not find coordinates for the provided locations');
        return;
      }

      // Create ride
      await ridesApi.create({
        from: {
          address: formData.from,
          latitude: fromCoords.latitude,
          longitude: fromCoords.longitude,
        },
        to: {
          address: formData.to,
          latitude: toCoords.latitude,
          longitude: toCoords.longitude,
        },
        departureTime: `${formData.date}T${formData.time}:00`,
        seats: validatedData.seats,
        price: validatedData.price,
        description: validatedData.description,
      });

      toast.success('Ride created successfully!');
      router.push('/marketplace');
    } catch (error) {
      if (error.errors) {
        const validationErrors = {};
        error.errors.forEach((err) => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors);
        toast.error('Please check the form for errors');
      } else {
        toast.error('Failed to create ride');
        console.error('Error creating ride:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const useCurrentLocation = async () => {
    if (location?.address) {
      setFormData((prev) => ({ ...prev, from: location.address }));
    } else {
      toast.error('Could not determine your current location');
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Connect your wallet to offer a ride
          </h2>
          <p className="mt-2 text-gray-600">
            You need to connect your TON wallet to create ride offers
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Offer a Ride - Onzrod</title>
        <meta
          name="description"
          content="Create a new ride offer on Onzrod"
        />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Offer a Ride</h1>
            <p className="mt-2 text-gray-600">
              Share your journey and earn TON
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="from" className="block text-sm font-medium text-gray-700">
                  From
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    name="from"
                    id="from"
                    required
                    value={formData.from}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.from ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Departure city"
                  />
                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                  >
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
                {errors.from && (
                  <p className="mt-1 text-sm text-red-600">{errors.from}</p>
                )}
              </div>

              <div>
                <label htmlFor="to" className="block text-sm font-medium text-gray-700">
                  To
                </label>
                <input
                  type="text"
                  name="to"
                  id="to"
                  required
                  value={formData.to}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.to ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Destination city"
                />
                {errors.to && (
                  <p className="mt-1 text-sm text-red-600">{errors.to}</p>
                )}
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.date}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  id="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.time ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                )}
              </div>

              <div>
                <label htmlFor="seats" className="block text-sm font-medium text-gray-700">
                  Available Seats
                </label>
                <input
                  type="number"
                  name="seats"
                  id="seats"
                  min="1"
                  max="8"
                  required
                  value={formData.seats}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.seats ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.seats && (
                  <p className="mt-1 text-sm text-red-600">{errors.seats}</p>
                )}
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price per Seat (TON)
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  min="0"
                  step="0.1"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.0"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Additional Information
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Add any details about your ride (luggage space, preferences, etc.)"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? 'Creating...' : 'Create Offer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateRidePage;
