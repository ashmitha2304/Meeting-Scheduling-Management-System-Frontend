/**
 * API Service
 * 
 * Centralized axios instance with:
 * - Automatic JWT token injection
 * - Token refresh on 401 errors
 * - Request/response interceptors
 * - Type-safe API methods
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  Meeting,
  MeetingListResponse,
  CreateMeetingForm,
  AssignParticipantsForm,
  MeetingFilters,
  ApiResponse,
} from '../types';
import { tokenStorage, clearAllAuth } from '../utils/storage';

// ============================================
// AXIOS INSTANCE CONFIGURATION
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================

/**
 * Automatically attach JWT access token to requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = tokenStorage.getAccessToken();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================

/**
 * Handle 401 errors with automatic token refresh
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request while token is being refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();

      if (!refreshToken) {
        // No refresh token - logout
        clearAllAuth();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh token
        const response = await axios.post<AuthResponse>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data.data;
        tokenStorage.setAccessToken(accessToken);

        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);
        isRefreshing = false;

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        isRefreshing = false;
        clearAllAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============================================
// AUTHENTICATION API
// ============================================

export const authApi = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await apiClient.post<ApiResponse<{ accessToken: string }>>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data.data!;
  },

  /**
   * Logout (client-side only - clear tokens)
   */
  logout: (): void => {
    clearAllAuth();
  },
};

// ============================================
// MEETING API
// ============================================

export const meetingApi = {
  /**
   * Create a new meeting (ORGANIZER only)
   */
  createMeeting: async (data: CreateMeetingForm): Promise<Meeting> => {
    const response = await apiClient.post<ApiResponse<Meeting>>('/meetings', data);
    return response.data.data!;
  },

  /**
   * Get all meetings (filtered)
   */
  getMeetings: async (filters?: MeetingFilters): Promise<Meeting[]> => {
    const response = await apiClient.get<MeetingListResponse>('/meetings', {
      params: filters,
    });
    return response.data.data.meetings;
  },

  /**
   * Get meetings assigned to authenticated participant
   */
  getMyMeetings: async (filters?: MeetingFilters): Promise<Meeting[]> => {
    const response = await apiClient.get<MeetingListResponse>('/meetings/my-meetings', {
      params: filters,
    });
    return response.data.data.meetings;
  },

  /**
   * Get single meeting by ID
   */
  getMeetingById: async (id: string): Promise<Meeting> => {
    const response = await apiClient.get<ApiResponse<Meeting>>(`/meetings/${id}`);
    return response.data.data!;
  },

  /**
   * Update meeting (ORGANIZER only)
   */
  updateMeeting: async (id: string, data: Partial<CreateMeetingForm>): Promise<Meeting> => {
    const response = await apiClient.put<ApiResponse<Meeting>>(`/meetings/${id}`, data);
    return response.data.data!;
  },

  /**
   * Cancel meeting (ORGANIZER only)
   */
  cancelMeeting: async (id: string): Promise<Meeting> => {
    const response = await apiClient.patch<ApiResponse<Meeting>>(`/meetings/${id}/cancel`);
    return response.data.data!;
  },

  /**
   * Delete meeting (ORGANIZER only)
   */
  deleteMeeting: async (id: string): Promise<void> => {
    await apiClient.delete(`/meetings/${id}`);
  },

  /**
   * Assign participants to meeting (ORGANIZER only)
   */
  assignParticipants: async (
    meetingId: string,
    data: AssignParticipantsForm
  ): Promise<Meeting> => {
    const response = await apiClient.post<ApiResponse<{ meeting: Meeting }>>(
      `/meetings/${meetingId}/assign`,
      data
    );
    return response.data.data!.meeting;
  },

  /**
   * Remove participants from meeting (ORGANIZER only)
   */
  removeParticipants: async (
    meetingId: string,
    data: AssignParticipantsForm
  ): Promise<Meeting> => {
    const response = await apiClient.post<ApiResponse<{ meeting: Meeting }>>(
      `/meetings/${meetingId}/remove`,
      data
    );
    return response.data.data!.meeting;
  },
};

// ============================================
// USER API
// ============================================

export const userApi = {
  /**
   * Get all users (for participant selection)
   */
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<{ users: User[] }>>('/users');
    return response.data.data!.users;
  },

  /**
   * Get users by role
   */
  getUsersByRole: async (role: 'ORGANIZER' | 'PARTICIPANT'): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<{ users: User[] }>>('/users', {
      params: { role },
    });
    return response.data.data!.users;
  },
};

// ============================================
// ERROR HANDLER
// ============================================

/**
 * Extract error message from axios error
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'An error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
};

export default apiClient;
