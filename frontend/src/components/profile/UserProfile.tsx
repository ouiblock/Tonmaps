import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Image from 'next/image';

interface WalletModalProps {
  onClose: () => void;
}

const WalletModal = ({ onClose }: WalletModalProps) => {
  const { connectWallet } = useAuth();
  const [address, setAddress] = useState('');

  const handleConnect = () => {
    if (address) {
      connectWallet(address);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#242F3D] rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-white mb-4">Connect TON Wallet</h3>
        <p className="text-gray-400 mb-4">
          Connect your TON wallet to receive rewards for your orders
        </p>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your TON wallet address"
          className="w-full p-3 rounded-lg bg-[#17212B] text-white mb-4"
        />
        <div className="flex space-x-3">
          <button
            onClick={handleConnect}
            disabled={!address}
            className="flex-1 px-4 py-2 rounded-lg bg-[#2AABEE] text-white hover:bg-[#2AABEE]/80 disabled:opacity-50"
          >
            Connect
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export const UserProfile = () => {
  const { user, logout, score } = useAuth();
  const [showWalletModal, setShowWalletModal] = useState(false);

  if (!user) return null;

  return (
    <div className="bg-[#242F3D] rounded-xl p-4">
      <div className="flex items-center space-x-4">
        <Image
          src={user.avatar}
          alt={user.name}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div className="flex-grow">
          <h3 className="text-white font-semibold">{user.name}</h3>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="px-3 py-1 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 text-sm"
        >
          Logout
        </button>
      </div>

      <div className="mt-4 p-3 bg-[#17212B] rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Your Score</p>
            <p className="text-[#2AABEE] text-xl font-bold">{score} points</p>
          </div>
          {!user.walletAddress ? (
            <button
              onClick={() => setShowWalletModal(true)}
              className="px-4 py-2 rounded-lg bg-[#2AABEE] text-white hover:bg-[#2AABEE]/80 text-sm"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="text-right">
              <p className="text-gray-400 text-sm">TON Wallet</p>
              <p className="text-white text-sm font-mono">
                {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
              </p>
            </div>
          )}
        </div>
      </div>

      {showWalletModal && (
        <WalletModal onClose={() => setShowWalletModal(false)} />
      )}
    </div>
  );
};
