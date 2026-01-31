/**
 * Frontend TypeScript Type Definitions
 * Mirrors backend types for type safety across client-server boundary
 */

// ============================================
// USER TYPES
// ============================================

export enum UserRole {
  ORGANIZER = 'ORGANIZER',
  PARTICIPANT = 'PARTICIPANT',
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// MEETING TYPES
// ============================================

export enum MeetingStatus {
  SCHEDULED = 'SCHEDULED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface Meeting {
  _id: string;
  title: string;
  description?: string;
  organizer: User;
  participants: User[];
  startTime: string; // ISO 8601 date string
  endTime: string;
  location?: string;
  meetingLink?: string;
  status: MeetingStatus;
  duration: number; // In minutes (virtual field)
  createdAt: string;
  updatedAt: string;
}

// ============================================
// AUTH TYPES
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface UserProfile {
  success: boolean;
  data: {
    user: User;
  };
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  details?: string;
}

export interface MeetingListResponse {
  success: boolean;
  data: {
    meetings: Meeting[];
    total: number;
    page?: number;
    limit?: number;
  };
}

export interface MeetingDetailResponse {
  success: boolean;
  data: Meeting;
}

// ============================================
// FORM TYPES
// ============================================

export interface CreateMeetingForm {
  title: string;
  description?: string;
  participantIds: string[];
  startTime: string;
  endTime: string;
  location?: string;
  meetingLink?: string;
}

export interface AssignParticipantsForm {
  participantIds: string[];
}

// ============================================
// FILTER TYPES
// ============================================

export interface MeetingFilters {
  status?: MeetingStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
