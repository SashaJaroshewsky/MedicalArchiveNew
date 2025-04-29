// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthResponse } from '../models/auth.model';
import { User } from '../models/user.model';
import AuthAPI from '../api/auth.api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (token: AuthResponse) => void;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // При завантаженні додатку перевіряємо, чи є збережений токен
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          setIsAuthenticated(true);
          setUser(JSON.parse(storedUser));
          
          // Перевіряємо валідність токену, отримуючи дані користувача
          const userProfile = await AuthAPI.getProfile();
          setUser(userProfile);
        } catch (err) {
          // Якщо токен невалідний, очищаємо локальне сховище
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
          setError('Сесія закінчилася. Будь ласка, увійдіть знову.');
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (authData: AuthResponse) => {
    localStorage.setItem('token', authData.accessToken);
    
    const userData: User = {
      id: authData.userId,
      email: authData.userEmail,
      role: authData.userRole,
      firstName: '',
      lastName: '',
      middleName: '',
      dateOfBirth: '',
      gender: '',
      phoneNumber: '',
      address: ''
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    
    setIsAuthenticated(true);
    setUser(userData);
    setError(null);
    
    // Отримуємо повні дані користувача
    AuthAPI.getProfile()
      .then(profile => {
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      })
      .catch(err => {
        console.error('Помилка отримання профілю користувача:', err);
      });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};