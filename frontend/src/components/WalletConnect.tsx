import { useWallet } from '../contexts/WalletContext';

const WalletConnect = () => {
  const { address, balance, isConnecting, error, connect, disconnect, userScore } = useWallet();

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      {!address ? (
        <button
          onClick={connect}
          disabled={isConnecting}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isConnecting ? 'Connecting...' : 'Connect TON Wallet'}
        </button>
      ) : (
        <div>
          <div className="mb-2">
            <p className="text-sm text-gray-600">Address: {address.slice(0, 6)}...{address.slice(-4)}</p>
            {balance && <p className="text-sm text-gray-600">Balance: {balance} TON</p>}
            <p className="text-sm text-gray-600">TMAPS Score: {userScore}</p>
          </div>
          <button
            onClick={disconnect}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Disconnect
          </button>
        </div>
      )}
      {error && (
        <p className="text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
};

export default WalletConnect;
