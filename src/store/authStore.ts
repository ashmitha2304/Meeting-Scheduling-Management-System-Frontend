/**
 * Authentication Store (Zustand)
 * 
 * Global state management for authentication:
 * - User profile
 * - JWT tokens
 * - Login/logout actions
 * - Persistent state across page refreshes
 */

import { create } from 'zustand';
import { User, LoginCredentials, RegisterData } from '../types';
import { authApi } from '../services/api';
import { tokenStorage, userStorage, clearAllAuth, initializeAuth } from '../utils/storage';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loadUserFromStorage: () => void;
  fetchProfile: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // ============================================
  // INITIAL STATE
  // ============================================
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // ============================================
  // LOGIN ACTION
  // ============================================
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authApi.login(credentials);
      const { user, accessToken, refreshToken } = response.data;

      // Save to localStorage
      tokenStorage.setTokens({ accessToken, refreshToken });
      userStorage.setUser(user);

      // Update state
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Login failed. Please try again.';

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  // ============================================
  // REGISTER ACTION
  // ============================================
  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authApi.register(data);
      const { user, accessToken, refreshToken } = response.data;

      // Save to localStorage
      tokenStorage.setTokens({ accessToken, refreshToken });
      userStorage.setUser(user);

      // Update state
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Registration failed. Please try again.';

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  // ============================================
  // LOGOUT ACTION
  // ============================================
  logout: () => {
    clearAllAuth();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  // ============================================
  // LOAD USER FROM LOCALSTORAGE
  // ============================================
  loadUserFromStorage: () => {
    const { user, accessToken } = initializeAuth();

    if (user && accessToken) {
      set({
        user,
        isAuthenticated: true,
      });
    }
  },

  // ============================================
  // FETCH FRESH USER PROFILE
  // ============================================
  fetchProfile: async () => {
    try {
      const user = await authApi.getProfile();
      userStorage.setUser(user);

      set({
        user,
        isAuthenticated: true,
      });
    } catch (error) {
      // Token expired or invalid - logout
      get().logout();
      throw error;
    }
  },

  // ============================================
  // CLEAR ERROR
  // ============================================
  clearError: () => {
    set({ error: null });
  },
}));
