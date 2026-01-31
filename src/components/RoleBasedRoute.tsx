/**
 * Role-Based Route Component
 * 
 * Restricts access based on user role (ORGANIZER vs PARTICIPANT).
 * Redirects unauthorized users to appropriate dashboard.
 */

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated } = useAuthStore();

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is allowed
  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = user.role === UserRole.ORGANIZER 
      ? '/organizer/dashboard' 
      : '/participant/dashboard';
    
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
