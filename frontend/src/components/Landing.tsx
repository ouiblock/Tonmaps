import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import Image from 'next/image';

const Landing = () => {
  const { setWalletAddress } = useWallet();

  const handleLaunchApp = () => {
    // Launch app without wallet
    setWalletAddress('guest');
  };

  return (
    <div className="min-h-screen bg-[#17212B] text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8">
          <Image
            src="/logo.svg"
            alt="TONmaps Logo"
            width={200}
            height={200}
            className="mb-8"
          />
          
          <h1 className="text-5xl md:text-7xl font-bold text-center bg-gradient-to-r from-[#2AABEE] to-blue-600 text-transparent bg-clip-text">
            TONmaps
          </h1>
          
          <p className="text-xl md:text-2xl text-center text-gray-400 max-w-2xl">
            Your all-in-one decentralized platform for ridesharing, food delivery, and package delivery.
            Earn TMAP tokens while using our services!
          </p>

          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <button
              onClick={handleLaunchApp}
              className="px-8 py-4 rounded-xl bg-[#2AABEE] text-white font-semibold hover:bg-[#2AABEE]/80 transition-colors text-lg"
            >
              Launch App
            </button>
            <a
              href="https://t.me/TON_MapsChat"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors text-lg text-center"
            >
              Join Community
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-[#242F3D] p-6 rounded-xl transform hover:scale-105 transition-transform">
              <h3 className="text-xl font-semibold mb-4 text-[#2AABEE]">🚗 Ridesharing</h3>
              <p className="text-gray-400">Share rides, save money, and earn rewards with our decentralized ridesharing platform.</p>
            </div>
            
            <div className="bg-[#242F3D] p-6 rounded-xl transform hover:scale-105 transition-transform">
              <h3 className="text-xl font-semibold mb-4 text-[#2AABEE]">🍔 Food Delivery</h3>
              <p className="text-gray-400">Order from your favorite restaurants and get 100% cashback in TMAP tokens on delivery fees.</p>
            </div>
            
            <div className="bg-[#242F3D] p-6 rounded-xl transform hover:scale-105 transition-transform">
              <h3 className="text-xl font-semibold mb-4 text-[#2AABEE]">📦 Package Delivery</h3>
              <p className="text-gray-400">Send and receive packages securely with our decentralized delivery network.</p>
            </div>
          </div>

          <div className="text-center text-gray-400 mt-16">
            <p className="mb-2">Want to earn more rewards?</p>
            <a
              href="https://ton.org/wallets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2AABEE] hover:underline"
            >
              Connect your TON wallet
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
