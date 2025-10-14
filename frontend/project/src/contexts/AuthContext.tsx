import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Vendor } from '../types';

interface AuthContextType {
  user: User | null;
  vendor: Vendor | null;
  userType: 'user' | 'vendor' | null;
  setUser: (user: User | null) => void;
  setVendor: (vendor: Vendor | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [vendor, setVendorState] = useState<Vendor | null>(null);
  const [userType, setUserType] = useState<'user' | 'vendor' | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedVendor = localStorage.getItem('vendor');

    if (storedUser) {
      setUserState(JSON.parse(storedUser));
      setUserType('user');
    } else if (storedVendor) {
      setVendorState(JSON.parse(storedVendor));
      setUserType('vendor');
    }
  }, []);

  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      setUserType('user');
      setVendorState(null);
      localStorage.removeItem('vendor');
    } else {
      localStorage.removeItem('user');
      setUserType(null);
    }
  };

  const setVendor = (vendor: Vendor | null) => {
    setVendorState(vendor);
    if (vendor) {
      localStorage.setItem('vendor', JSON.stringify(vendor));
      setUserType('vendor');
      setUserState(null);
      localStorage.removeItem('user');
    } else {
      localStorage.removeItem('vendor');
      setUserType(null);
    }
  };

  const logout = () => {
    setUserState(null);
    setVendorState(null);
    setUserType(null);
    localStorage.removeItem('user');
    localStorage.removeItem('vendor');
  };

  return (
    <AuthContext.Provider value={{ user, vendor, userType, setUser, setVendor, logout }}>
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
