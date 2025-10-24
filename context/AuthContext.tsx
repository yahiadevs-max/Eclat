import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface AdminPermissions {
  products: boolean;
  orders: boolean;
  stock: boolean;
  deliveries: boolean;
  payments: boolean;
  returns: boolean;
  shipping: boolean;
}

interface User {
  username: string;
  role: 'superadmin' | 'admin';
  permissions?: AdminPermissions;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: string, pass: string): boolean => {
    // In a real app, this would be an API call.
    if (user === 'yahia' && pass === 'yahia') {
      setUser({ username: 'yahia', role: 'superadmin' });
      return true;
    }
    if (user === 'admin' && pass === 'admin') {
      setUser({ 
        username: 'admin', 
        role: 'admin',
        permissions: {
          products: true,
          orders: true,
          stock: false,
          deliveries: false,
          payments: false,
          returns: false,
          shipping: true,
        }
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};