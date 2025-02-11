import React, { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: 'ride' | 'parcel';
  item: {
    id: string;
    from: string;
    to: string;
    price?: number;
    reward?: number;
  };
  onConfirm: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  itemType,
  item,
  onConfirm,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { address } = useWallet();

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      // In a real app, this would integrate with TON wallet for payment
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
      onConfirm();
      onClose();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const amount = itemType === 'ride' ? item.price : item.reward;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">
          {itemType === 'ride' ? 'Book Ride' : 'Accept Delivery'}
        </h2>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">From</span>
            <span className="font-medium">{item.from}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">To</span>
            <span className="font-medium">{item.to}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="font-medium">Total Amount</span>
            <span className="font-bold text-blue-600">{amount} TON</span>
          </div>
        </div>

        <div className="flex justify-between space-x-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing || !address}
            className={`flex-1 py-2 px-4 rounded-lg font-medium ${
              isProcessing || !address
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isProcessing
              ? 'Processing...'
              : itemType === 'ride'
              ? 'Pay & Book'
              : 'Accept & Pay Deposit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
