/**
 * Main App Component
 * 
 * Sets up routing with role-based access control:
 * - Public routes: /login, /register
 * - Protected routes: /organizer/*, /participant/*
 * - Automatic redirect based on user role
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleBasedRoute } from './components/RoleBasedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { ParticipantDashboard } from './pages/ParticipantDashboard';
import { UserRole } from './types';

function App() {
  const { loadUserFromStorage, isAuthenticated, user } = useAuthStore();

  // Load user from localStorage on mount
  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  // Redirect authenticated users from root to their dashboard
  const getDefaultRoute = () => {
    if (!isAuthenticated || !user) {
      return <Navigate to="/login" replace />;
    }

    return user.role === UserRole.ORGANIZER ? (
      <Navigate to="/organizer/dashboard" replace />
    ) : (
      <Navigate to="/participant/dashboard" replace />
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - Organizer */}
        <Route
          path="/organizer/dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={[UserRole.ORGANIZER]}>
                <OrganizerDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Participant */}
        <Route
          path="/participant/dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={[UserRole.PARTICIPANT]}>
                <ParticipantDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={getDefaultRoute()} />

        {/* 404 - Redirect to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
