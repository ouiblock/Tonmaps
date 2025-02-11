import { useState } from 'react';
import Image from 'next/image';
import { FoodOrder } from '../../types/food';

interface PaymentModalProps {
  order: Omit<FoodOrder, 'courierLocation' | 'estimatedDeliveryTime' | 'courierId'>;
  onClose: () => void;
  onPaymentComplete: (method: 'TON' | 'USDC' | 'card') => void;
}

export const PaymentModal = ({ order, onClose, onPaymentComplete }: PaymentModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'TON' | 'USDC' | 'card'>('TON');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onPaymentComplete(selectedMethod);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#242F3D] rounded-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>

        {/* Payment Methods */}
        <div className="space-y-4 mb-6">
          <button
            onClick={() => setSelectedMethod('TON')}
            className={`w-full p-4 rounded-xl flex items-center justify-between ${
              selectedMethod === 'TON'
                ? 'bg-[#2AABEE]/20 border-2 border-[#2AABEE]'
                : 'bg-[#17212B] border-2 border-transparent'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Image
                src="/ton-logo.svg"
                alt="TON"
                width={32}
                height={32}
              />
              <div className="text-left">
                <div className="font-semibold text-white">Pay with TON</div>
                <div className="text-sm text-gray-400">Get 100% TMAP Cashback</div>
              </div>
            </div>
            <div className="text-[#2AABEE] font-semibold">
              {order.amount.toFixed(2)} TON
            </div>
          </button>

          <button
            onClick={() => setSelectedMethod('USDC')}
            className={`w-full p-4 rounded-xl flex items-center justify-between ${
              selectedMethod === 'USDC'
                ? 'bg-[#2AABEE]/20 border-2 border-[#2AABEE]'
                : 'bg-[#17212B] border-2 border-transparent'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Image
                src="/usdc-logo.svg"
                alt="USDC"
                width={32}
                height={32}
              />
              <div className="text-left">
                <div className="font-semibold text-white">Pay with USDC</div>
                <div className="text-sm text-gray-400">Stablecoin payment</div>
              </div>
            </div>
            <div className="text-[#2AABEE] font-semibold">
              {order.amount.toFixed(2)} USDC
            </div>
          </button>

          <button
            onClick={() => setSelectedMethod('card')}
            className={`w-full p-4 rounded-xl flex items-center justify-between ${
              selectedMethod === 'card'
                ? 'bg-[#2AABEE]/20 border-2 border-[#2AABEE]'
                : 'bg-[#17212B] border-2 border-transparent'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Image
                src="/card-icon.svg"
                alt="Card"
                width={32}
                height={32}
              />
              <div className="text-left">
                <div className="font-semibold text-white">Credit Card</div>
                <div className="text-sm text-gray-400">Visa, Mastercard, etc.</div>
              </div>
            </div>
            <div className="text-[#2AABEE] font-semibold">
              ${order.amount.toFixed(2)}
            </div>
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-[#17212B] rounded-xl p-4 mb-6">
          <h3 className="text-white font-semibold mb-2">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white">${(order.amount - order.deliveryFee).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Delivery Fee</span>
              <span className="text-white">${order.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#2AABEE]">
              <span>TMAP Reward</span>
              <span>{order.tmapReward.toFixed(2)} TMAP</span>
            </div>
            <div className="pt-2 border-t border-gray-700 flex justify-between font-semibold">
              <span className="text-white">Total</span>
              <span className="text-white">${order.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-red-500/20 text-red-500 hover:bg-red-500/30 font-semibold"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            className="flex-1 px-4 py-3 rounded-xl bg-[#2AABEE] text-white hover:bg-[#2AABEE]/80 font-semibold disabled:opacity-50"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
