import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { TonConnect } from '@tonconnect/sdk';
import { useAuth } from './AuthContext';
import { Address, toNano, fromNano } from 'ton';

interface WalletContextType {
  connector: TonConnect | null;
  isConnected: boolean;
  balance: string;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendTransaction: (to: string, amount: number) => Promise<void>;
  isConnecting: boolean;
  activeWallet: any | null;
  error: string | null;
  userScore: number;
}

const WalletContext = createContext<WalletContextType>({
  connector: null,
  isConnected: false,
  balance: '0',
  address: null,
  connect: async () => {},
  disconnect: async () => {},
  sendTransaction: async () => {},
  isConnecting: false,
  activeWallet: null,
  error: null,
  userScore: 0,
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connector, setConnector] = useState<TonConnect | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState('0');
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeWallet, setActiveWallet] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userScore, setUserScore] = useState<number>(0);
  const { user } = useAuth();

  useEffect(() => {
    // Initialize TonConnect only on the client side
    if (typeof window !== 'undefined') {
      const initConnector = async () => {
        try {
          const newConnector = new TonConnect({
            manifestUrl: 'https://onzrod.com/tonconnect-manifest.json',
          });
          setConnector(newConnector);

          // Restore connection if previously connected
          const walletConnectionSource = await newConnector.restoreConnection();
          setIsConnected(!!walletConnectionSource);

          if (walletConnectionSource) {
            const walletBalance = await newConnector.wallet?.ton.balance;
            setBalance(walletBalance?.toString() || '0');
            setAddress(walletConnectionSource.account.address);
            setActiveWallet(walletConnectionSource);
            await fetchUserScore(walletConnectionSource.account.address);
          }
        } catch (error) {
          console.error('Failed to initialize TonConnect:', error);
        }
      };

      initConnector();
    }
  }, []);

  const connect = async () => {
    if (!connector) return;
    try {
      setIsConnecting(true);
      const walletConnectionSource = await connector.connect();
      setIsConnected(!!walletConnectionSource);

      if (walletConnectionSource) {
        const walletBalance = await connector.wallet?.ton.balance;
        setBalance(walletBalance?.toString() || '0');
        setAddress(walletConnectionSource.account.address);
        setActiveWallet(walletConnectionSource);
        await fetchUserScore(walletConnectionSource.account.address);
      }
    } catch (error) {
      setError('Failed to connect wallet');
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    if (!connector) return;
    try {
      await connector.disconnect();
      setIsConnected(false);
      setBalance('0');
      setAddress(null);
      setActiveWallet(null);
      setUserScore(0);
      setError(null);
    } catch (error) {
      setError('Failed to disconnect wallet');
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const sendTransaction = async (to: string, amount: number) => {
    try {
      setError(null);
      if (!activeWallet) throw new Error('Wallet not connected');
      if (Number(balance) < amount) throw new Error('Insufficient balance');

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes
        messages: [
          {
            address: to,
            amount: toNano(amount.toString()).toString(),
          },
        ],
      };

      const result = await connector.sendTransaction(transaction);
      
      if (address) {
        const walletBalance = await connector.wallet?.ton.balance;
        setBalance(walletBalance?.toString() || '0');
        // Update user score after successful transaction
        await fetchUserScore(address);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      setError(errorMessage);
      console.error('Error sending transaction:', error);
      throw error;
    }
  };

  const fetchUserScore = async (walletAddress: string) => {
    try {
      // In production, this would be an API call to your backend
      const response = await fetch(`/api/user/score?address=${walletAddress}`);
      const data = await response.json();
      if (data.ok) {
        setUserScore(data.score);
      }
    } catch (err) {
      console.error('Error fetching user score:', err);
      setUserScore(0);
    }
  };

  useEffect(() => {
    if (!connector) return;

    const unsubscribe = connector.onStatusChange((wallet) => {
      if (wallet) {
        setActiveWallet(wallet);
        setAddress(wallet.account.address);
        const walletBalance = wallet.ton.balance;
        setBalance(walletBalance?.toString() || '0');
        fetchUserScore(wallet.account.address);
      } else {
        setActiveWallet(null);
        setAddress(null);
        setBalance('0');
        setUserScore(0);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        connector,
        isConnected,
        balance,
        address,
        connect,
        disconnect,
        sendTransaction,
        isConnecting,
        activeWallet,
        error,
        userScore,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
