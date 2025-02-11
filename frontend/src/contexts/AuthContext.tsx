import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  provider: string;
  telegramUsername?: string;
  avatar?: string;
  score: number;
}

interface AuthContextType {
  user: User | null;
  loginAsTestUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginAsTestUser = async () => {
    const testUser: User = {
      id: 'test-user-123',
      name: 'Test User',
      email: 'test@example.com',
      provider: 'test',
      telegramUsername: '@testuser',
      avatar: 'https://via.placeholder.com/150',
      score: 100
    };
    
    setUser(testUser);
    localStorage.setItem('user', JSON.stringify(testUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loginAsTestUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
