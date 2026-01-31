/**
 * LocalStorage Utility
 * 
 * Manages JWT tokens and user data in browser localStorage.
 * Provides type-safe storage/retrieval with automatic JSON parsing.
 */

import { User, AuthTokens } from '../types';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
} as const;

/**
 * Token Management
 */
export const tokenStorage = {
  /**
   * Save access token to localStorage
   */
  setAccessToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  /**
   * Get access token from localStorage
   */
  getAccessToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Save refresh token to localStorage
   */
  setRefreshToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Save both tokens at once
   */
  setTokens: (tokens: AuthTokens): void => {
    tokenStorage.setAccessToken(tokens.accessToken);
    tokenStorage.setRefreshToken(tokens.refreshToken);
  },

  /**
   * Clear all tokens from localStorage
   */
  clearTokens: (): void => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Check if user is authenticated (has access token)
   */
  isAuthenticated: (): boolean => {
    return !!tokenStorage.getAccessToken();
  },
};

/**
 * User Data Management
 */
export const userStorage = {
  /**
   * Save user profile to localStorage
   */
  setUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  /**
   * Get user profile from localStorage
   */
  getUser: (): User | null => {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as User;
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  },

  /**
   * Clear user data from localStorage
   */
  clearUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * Update specific user fields (merge with existing)
   */
  updateUser: (updates: Partial<User>): void => {
    const currentUser = userStorage.getUser();
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    userStorage.setUser(updatedUser);
  },
};

/**
 * Clear all authentication data (tokens + user)
 * Use on logout or authentication failure
 */
export const clearAllAuth = (): void => {
  tokenStorage.clearTokens();
  userStorage.clearUser();
};

/**
 * Initialize authentication from localStorage
 * Returns user and tokens if they exist
 */
export const initializeAuth = (): {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
} => {
  return {
    user: userStorage.getUser(),
    accessToken: tokenStorage.getAccessToken(),
    refreshToken: tokenStorage.getRefreshToken(),
  };
};
