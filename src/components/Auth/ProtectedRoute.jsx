
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import { logger } from '../../services/Logger';

const ProtectedRoute = ({ children, requiredRole = null, redirectTo = '/login' }) => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();


  if (!isAuthenticated) {
    logger.warn('ProtectedRoute: Unauthorized access attempt', { 
      redirectTo 
    });
    return <Navigate to={redirectTo} replace />;
  }


  if (requiredRole && currentUser?.rol !== requiredRole) {
    logger.warn('ProtectedRoute: Insufficient permissions', {
      requiredRole,
      userRole: currentUser?.rol,
    });


    const fallbackPath = currentUser?.rol === 'administrador' 
      ? '/admin/dashboard' 
      : '/dashboard';

    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
