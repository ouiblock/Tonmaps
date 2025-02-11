import { AppProps } from 'next/app';
import { useEffect } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { WalletProvider } from '../contexts/WalletContext';
import { mapsService } from '../services/MapsService';
import MainLayout from '../components/layout/MainLayout';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const initMaps = async () => {
      try {
        await mapsService.initialize();
      } catch (error) {
        console.error('Failed to initialize Google Maps:', error);
      }
    };
    initMaps();
  }, []);

  return (
    <AuthProvider>
      <WalletProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </WalletProvider>
    </AuthProvider>
  );
}
