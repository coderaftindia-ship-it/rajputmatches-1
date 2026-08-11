import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { storageService } from '../services/storage.service';
import { API_CONFIG } from '../config/api.config';
import { authApi, LoginPayload, RegisterPayload } from '../services/auth.api';
import { meApi } from '../services/me.api';
import { apiClient, onUnauthorizedLogout } from '../services/apiClient';

export interface UserProfile {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  mobile?: string;
  age?: number | string;
  gender?: string;
  gotra?: string;
  education?: string;
  location?: string;
  occupation?: string;
  avatar?: string;
  profileImage?: string;
  isVerified?: boolean;
  [key: string]: any;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<any>;
  register: (payload: RegisterPayload) => Promise<any>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUserData = useCallback(async () => {
    try {
      // GET /api/v1/auth/user — fetch logged-in user profile from backend
      const userData = await meApi.getProfile();
      if (userData) {
        const normalized = userData.user || userData.data || userData;
        setUser(normalized);
        await storageService.setObject(API_CONFIG.USER_STORAGE_KEY, normalized);
      }
    } catch (err) {
      console.warn('Failed to load user profile data:', err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      try {
        const storedToken = await storageService.getItem(API_CONFIG.TOKEN_STORAGE_KEY);
        const storedUser = await storageService.getObject<UserProfile>(API_CONFIG.USER_STORAGE_KEY);

        if (storedToken && isMounted) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (e) {
        console.warn('Failed to load session:', e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initSession();

    // Listen for global 401 logout trigger
    const unsubscribe = onUnauthorizedLogout(() => {
      if (isMounted) {
        setToken(null);
        setUser(null);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (credentials: LoginPayload) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      const authToken = apiClient.getTokenFromResponse(response) || response?.token;

      if (authToken) {
        setToken(authToken);
        await storageService.setItem(API_CONFIG.TOKEN_STORAGE_KEY, authToken);

        const userData = response.user || response.data?.user || response.data || { email: credentials.email };
        setUser(userData);
        await storageService.setObject(API_CONFIG.USER_STORAGE_KEY, userData);

        // Fetch complete profile in background
        refreshUserData();
        return response;
      } else {
        throw new Error(response?.message || 'Login failed: Token not received');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(payload);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout().catch(() => {});
    } finally {
      await storageService.removeItem(API_CONFIG.TOKEN_STORAGE_KEY);
      await storageService.removeItem(API_CONFIG.USER_STORAGE_KEY);
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        refreshUserData,
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

export default AuthContext;
