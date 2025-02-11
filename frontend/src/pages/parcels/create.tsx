import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useWallet } from '@/contexts/WalletContext';

const CreateParcelPage: NextPage = () => {
  const router = useRouter();
  const { address } = useWallet();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    deadline: '',
    time: '',
    size: 'small',
    weight: '',
    reward: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to your API
    console.log('Form submitted:', formData);
    router.push('/marketplace');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Connect your wallet to create a delivery request
          </h2>
          <p className="mt-2 text-gray-600">
            You need to connect your TON wallet to create delivery requests
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Create Delivery Request - Onzrod</title>
        <meta
          name="description"
          content="Create a new delivery request on Onzrod"
        />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Delivery Request</h1>
            <p className="mt-2 text-gray-600">
              Request a parcel delivery and set your terms
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="from" className="block text-sm font-medium text-gray-700">
                  Pickup Location
                </label>
                <input
                  type="text"
                  name="from"
                  id="from"
                  required
                  value={formData.from}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Pickup address"
                />
              </div>

              <div>
                <label htmlFor="to" className="block text-sm font-medium text-gray-700">
                  Delivery Location
                </label>
                <input
                  type="text"
                  name="to"
                  id="to"
                  required
                  value={formData.to}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Delivery address"
                />
              </div>

              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                  Delivery Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  id="deadline"
                  required
                  value={formData.deadline}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Preferred Time
                </label>
                <input
                  type="time"
                  name="time"
                  id="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                  Parcel Size
                </label>
                <select
                  name="size"
                  id="size"
                  required
                  value={formData.size}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="small">Small (up to 5kg)</option>
                  <option value="medium">Medium (5-15kg)</option>
                  <option value="large">Large (15-30kg)</option>
                </select>
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  id="weight"
                  min="0.1"
                  max="30"
                  step="0.1"
                  required
                  value={formData.weight}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="0.0"
                />
              </div>

              <div>
                <label htmlFor="reward" className="block text-sm font-medium text-gray-700">
                  Delivery Reward (TON)
                </label>
                <input
                  type="number"
                  name="reward"
                  id="reward"
                  min="0"
                  step="0.1"
                  required
                  value={formData.reward}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="0.0"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Package Details
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe your package (fragile, special handling instructions, etc.)"
              />
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
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateParcelPage;
