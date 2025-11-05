/**
 * useAuth Hook
 * React hook for easy access to authentication functionality
 * Provides auth state and methods to any component
 */

import { useState, useEffect } from 'react';
import { authService } from '../services/AuthService';
import { logger } from '../services/Logger';

export const useAuth = () => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Subscribe to auth changes
    const unsubscribe = authService.onAuthChange((authenticated, userData) => {
      setIsAuthenticated(authenticated);
      setUser(userData);
      logger.debug('useAuth: Auth state changed', { authenticated });
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  /**
   * Login user
   */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register user
   */
  const register = async (userData) => {
    setIsLoading(true);
    try {
      const result = await authService.register(userData);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    return authService.logout();
  };

  /**
   * Refresh token
   */
  const refreshToken = async () => {
    return await authService.refreshToken();
  };

  /**
   * Update user profile
   */
  const updateProfile = async (profileData) => {
    setIsLoading(true);
    try {
      const result = await authService.updateProfile(profileData);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get user profile from server
   */
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
    // State
    user,
    isAuthenticated,
    isLoading,
    
    // Role checks
    isAdmin: user?.rol === 'administrador',
    isConsumer: user?.rol === 'consumidor',
    
    // Methods
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    fetchUserProfile,
  };
};

export default useAuth;
