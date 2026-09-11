import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  register: (data: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('agroassist_jwt_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    const savedToken = localStorage.getItem('agroassist_jwt_token');
    if (!savedToken) {
      setUser(null);
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await authApi.getMe();
      if (res.data.success) {
        setUser(res.data.user);
        setProfile(res.data.profile);
      } else {
        localStorage.removeItem('agroassist_jwt_token');
        setToken(null);
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.warn('Authentication token expired or server reset:', error);
      localStorage.removeItem('agroassist_jwt_token');
      setToken(null);
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const res = await authApi.login(credentials);
      if (res.data.success && res.data.token) {
        localStorage.setItem('agroassist_jwt_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        await refreshUser();
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to authenticate';
      return { success: false, message: msg };
    }
  };

  const register = async (data: any) => {
    try {
      const res = await authApi.register(data);
      if (res.data.success && res.data.token) {
        localStorage.setItem('agroassist_jwt_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        await refreshUser();
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('agroassist_jwt_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const switchDemoRole = async (role: UserRole) => {
    setIsLoading(true);
    let email = 'farmer@agroassist.gov.in';
    let password = 'farmer123';

    if (role === 'customer') {
      email = 'customer@agroassist.gov.in';
      password = 'customer123';
    } else if (role === 'officer') {
      email = 'officer@agroassist.gov.in';
      password = 'officer123';
    } else if (role === 'admin') {
      email = 'admin@agroassist.gov.in';
      password = 'admin123';
    }

    await login({ email, password });
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
