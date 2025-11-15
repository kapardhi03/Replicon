import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'master' | 'follower';
  phone?: string;
  isEmailVerified: boolean;
  isKYCVerified: boolean;
  has2FAEnabled: boolean;
  onboardingCompleted: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWith2FA: (code: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'master' | 'follower';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needs2FA, setNeeds2FA] = useState(false);
  const [tempCredentials, setTempCredentials] = useState<{ email: string; password: string } | null>(null);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        // TODO: Replace with actual API call
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user data - replace with actual API response
      const mockUser: User = {
        id: '1',
        email,
        name: 'Test User',
        role: 'master',
        phone: '+91 98765 43210',
        isEmailVerified: true,
        isKYCVerified: false,
        has2FAEnabled: false,
        onboardingCompleted: false,
      };

      // Check if 2FA is enabled
      if (mockUser.has2FAEnabled) {
        setTempCredentials({ email, password });
        setNeeds2FA(true);
        throw new Error('2FA_REQUIRED');
      }

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWith2FA = async (code: string) => {
    try {
      setIsLoading(true);

      if (!tempCredentials) {
        throw new Error('No pending 2FA login');
      }

      // TODO: Verify 2FA code with API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: '1',
        email: tempCredentials.email,
        name: 'Test User',
        role: 'master',
        phone: '+91 98765 43210',
        isEmailVerified: true,
        isKYCVerified: false,
        has2FAEnabled: true,
        onboardingCompleted: false,
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setNeeds2FA(false);
      setTempCredentials(null);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newUser: User = {
        id: Math.random().toString(36).substring(7),
        email: data.email,
        name: data.name,
        role: data.role,
        phone: data.phone,
        isEmailVerified: false,
        isKYCVerified: false,
        has2FAEnabled: false,
        onboardingCompleted: false,
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setNeeds2FA(false);
    setTempCredentials(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (user) {
        updateUser({ isEmailVerified: true });
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWith2FA,
    register,
    logout,
    updateUser,
    resetPassword,
    verifyEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
