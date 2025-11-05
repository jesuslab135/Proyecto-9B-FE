/**
 * AuthService - Singleton Pattern
 * Handles authentication, authorization, and JWT token management
 * Implements role-based access control for admin and consumer users
 */

import { UsuariosAPI } from '../utils/api/usuarios.client';
import { storageService } from './StorageService';
import { logger } from './Logger';

class AuthService {
  static instance = null;

  constructor() {
    if (AuthService.instance) {
      return AuthService.instance;
    }

    this.ROLES = {
      ADMIN: 'administrador',
      CONSUMER: 'consumidor',
    };

    this.currentUser = null;
    this.authCallbacks = [];

    // Initialize from storage
    this._initializeFromStorage();

    AuthService.instance = this;
  }

  /**
   * Get singleton instance
   */
  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Initialize authentication state from storage
   */
  _initializeFromStorage() {
    try {
      if (storageService.isAuthenticated()) {
        this.currentUser = storageService.getUser();
        logger.info('AuthService: User restored from storage', { 
          userId: this.currentUser?.id,
          role: this.currentUser?.rol 
        });
      }
    } catch (error) {
      logger.error('AuthService: Failed to initialize from storage', error);
      this.logout();
    }
  }

  /**
   * Subscribe to authentication state changes
   */
  onAuthChange(callback) {
    this.authCallbacks.push(callback);
    return () => {
      this.authCallbacks = this.authCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all subscribers of auth state change
   */
  _notifyAuthChange(isAuthenticated, user = null) {
    this.authCallbacks.forEach(callback => {
      try {
        callback(isAuthenticated, user);
      } catch (error) {
        logger.error('AuthService: Error in auth callback', error);
      }
    });
  }

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data with token
   */
  async login(email, password) {
    try {
      logger.info('AuthService: Attempting login', { email });

      const response = await UsuariosAPI.login(email, password);

      const { token, refresh_token, user, expires_in } = response;

      // Validate response
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      // Store authentication data
      storageService.setToken(token, expires_in);
      if (refresh_token) {
        storageService.setRefreshToken(refresh_token);
      }
      storageService.setUser(user);

      this.currentUser = user;

      logger.info('AuthService: Login successful', {
        userId: user.id,
        role: user.rol,
      });

      this._notifyAuthChange(true, user);

      return {
        success: true,
        user,
        redirectTo: this._getRedirectPath(user.rol),
      };
    } catch (error) {
      logger.error('AuthService: Login failed', error);
      
      // Parse error message
      const errorMessage = error.response?.data?.detail 
        || error.response?.data?.message 
        || error.message 
        || 'Error al iniciar sesión';

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration result
   */
  async register(userData) {
    try {
      logger.info('AuthService: Attempting registration', { 
        email: userData.email 
      });

      const response = await UsuariosAPI.register({
        nombre: userData.nombre,
        email: userData.email,
        password: userData.password,
        telefono: userData.telefono || null,
        rol: userData.rol || this.ROLES.CONSUMER, // Default to consumer
      });

      const { token, user, expires_in } = response;

      // Auto-login after registration
      if (token && user) {
        storageService.setToken(token, expires_in);
        storageService.setUser(user);
        this.currentUser = user;

        logger.info('AuthService: Registration and auto-login successful', {
          userId: user.id,
        });

        this._notifyAuthChange(true, user);
      }

      return {
        success: true,
        user,
        message: 'Registro exitoso',
      };
    } catch (error) {
      logger.error('AuthService: Registration failed', error);

      const errorMessage = error.response?.data?.detail 
        || error.response?.data?.message 
        || error.message 
        || 'Error al registrar usuario';

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Logout current user
   */
  logout() {
    logger.info('AuthService: User logging out', {
      userId: this.currentUser?.id,
    });

    this.currentUser = null;
    storageService.clearAuth();
    this._notifyAuthChange(false, null);

    return {
      success: true,
      redirectTo: '/login',
    };
  }

  /**
   * Refresh authentication token (not available in backend)
   */
  async refreshToken() {
    try {
      logger.warn('AuthService: Token refresh not implemented in backend');
      // Since refresh token endpoint doesn't exist, just logout
      this.logout();

      return {
        success: false,
        error: 'Sesión expirada',
      };
    } catch (error) {
      logger.error('AuthService: Token refresh failed', error);
      this.logout();

      return {
        success: false,
        error: 'Sesión expirada',
      };
    }
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return storageService.isAuthenticated() && this.currentUser !== null;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role) {
    return this.currentUser?.rol === role;
  }

  /**
   * Check if user is admin
   */
  isAdmin() {
    return this.hasRole(this.ROLES.ADMIN);
  }

  /**
   * Check if user is consumer
   */
  isConsumer() {
    return this.hasRole(this.ROLES.CONSUMER);
  }

  /**
   * Get redirect path based on user role
   */
  _getRedirectPath(role) {
    switch (role) {
      case this.ROLES.ADMIN:
        return '/admin/dashboard';
      case this.ROLES.CONSUMER:
        return '/dashboard';
      default:
        return '/';
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile() {
    try {
      const userId = this.currentUser?.id;
      
      if (!userId) {
        throw new Error('No authenticated user');
      }

      logger.debug('AuthService: Fetching user profile');

      const user = await UsuariosAPI.get(userId);

      // Update stored user data
      storageService.setUser(user);
      this.currentUser = user;

      return {
        success: true,
        user,
      };
    } catch (error) {
      logger.error('AuthService: Failed to fetch user profile', error);

      return {
        success: false,
        error: 'Error al obtener perfil de usuario',
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userData) {
    try {
      const userId = this.currentUser?.id;
      
      if (!userId) {
        throw new Error('No authenticated user');
      }

      logger.info('AuthService: Updating user profile');

      const user = await UsuariosAPI.patch(userId, userData);

      // Update stored user data
      storageService.setUser(user);
      this.currentUser = user;

      logger.info('AuthService: Profile updated successfully');

      return {
        success: true,
        user,
        message: 'Perfil actualizado exitosamente',
      };
    } catch (error) {
      logger.error('AuthService: Failed to update profile', error);

      return {
        success: false,
        error: 'Error al actualizar perfil',
      };
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
export default authService;
