/**
 * ProtectedRoute Component
 * Implements role-based access control for routes
 * Redirects unauthorized users to appropriate pages
 */

import { Navigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import { logger } from '../../services/Logger';

const ProtectedRoute = ({ children, requiredRole = null, redirectTo = '/login' }) => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  // Check authentication
  if (!isAuthenticated) {
    logger.warn('ProtectedRoute: Unauthorized access attempt', { 
      redirectTo 
    });
    return <Navigate to={redirectTo} replace />;
  }

  // Check role if specified
  if (requiredRole && currentUser?.rol !== requiredRole) {
    logger.warn('ProtectedRoute: Insufficient permissions', {
      requiredRole,
      userRole: currentUser?.rol,
    });

    // Redirect to appropriate page based on user role
    const fallbackPath = currentUser?.rol === 'administrador' 
      ? '/admin/dashboard' 
      : '/dashboard';

    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
