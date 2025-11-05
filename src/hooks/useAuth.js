
import { useState, useEffect } from 'react';
import { authService } from '../services/AuthService';
import { logger } from '../services/Logger';

export const useAuth = () => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.onAuthChange((authenticated, userData) => {
      setIsAuthenticated(authenticated);
      setUser(userData);
      logger.debug('useAuth: Auth state changed', { authenticated });
    });

    return () => unsubscribe();
  }, []);


  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      return result;
    } finally {
      setIsLoading(false);
    }
  };


  const register = async (userData) => {
    setIsLoading(true);
    try {
      const result = await authService.register(userData);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    return authService.logout();
  };


  const refreshToken = async () => {
    return await authService.refreshToken();
  };


  const updateProfile = async (profileData) => {
    setIsLoading(true);
    try {
      const result = await authService.updateProfile(profileData);
      return result;
    } finally {
      setIsLoading(false);
    }
  };


  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const result = await authService.getUserProfile();
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    
    isAdmin: user?.rol === 'administrador',
    isConsumer: user?.rol === 'consumidor',
    
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    fetchUserProfile,
  };
};

export default useAuth;
