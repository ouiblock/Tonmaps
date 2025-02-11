import { useState } from 'react';
import { RideListing } from '../../types';

interface PaymentModalProps {
  ride: RideListing;
  seats: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal = ({ ride, seats, onClose, onSuccess }: PaymentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const totalPrice = parseFloat(ride.price) * seats;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#17212B] rounded-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">Payment</h2>
        
        <div className="mb-6">
          <div className="flex justify-between text-gray-300 mb-2">
            <span>Total amount:</span>
            <span className="font-bold text-white">
              {totalPrice} {ride.currency}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Card number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
              className="w-full px-4 py-2 rounded-lg bg-[#242f3d] text-white border border-gray-600 focus:border-[#2AABEE] focus:outline-none"
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-300 text-sm mb-2">
                Expiry date
              </label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 4) {
                    setExpiry(value.replace(/(\d{2})(\d{2})/, '$1/$2'));
                  }
                }}
                className="w-full px-4 py-2 rounded-lg bg-[#242f3d] text-white border border-gray-600 focus:border-[#2AABEE] focus:outline-none"
                placeholder="MM/YY"
                required
              />
            </div>

            <div className="w-24">
              <label className="block text-gray-300 text-sm mb-2">
                CVC
              </label>
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                className="w-full px-4 py-2 rounded-lg bg-[#242f3d] text-white border border-gray-600 focus:border-[#2AABEE] focus:outline-none"
                placeholder="123"
                required
              />
            </div>
          </div>

          <div className="pt-4 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-[#2AABEE] hover:bg-[#2AABEE]/80 text-white transition-colors flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Pay'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
