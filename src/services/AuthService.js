
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

    this._initializeFromStorage();

    AuthService.instance = this;
  }


  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }


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


  onAuthChange(callback) {
    this.authCallbacks.push(callback);
    return () => {
      this.authCallbacks = this.authCallbacks.filter(cb => cb !== callback);
    };
  }


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
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>}
   */
  async login(email, password) {
    try {
      logger.info('AuthService: Attempting login', { email });

      const response = await UsuariosAPI.login(email, password);
      
      // Log para ver qué devuelve el backend
      logger.debug('AuthService: Backend response', response);
      console.log('🔍 Backend login response:', response);

      const { token, refresh_token, user, expires_in } = response;


      if (!token || !user) {
        console.error('❌ Missing token or user in response:', { token: !!token, user: !!user });
        throw new Error('Invalid response from server');
      }

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
   * @param {Object} userData - 
   * @returns {Promise<Object>} 
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
        rol: userData.rol || this.ROLES.CONSUMER, 
      });

      const { token, user, expires_in } = response;

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


  async refreshToken() {
    try {
      logger.warn('AuthService: Token refresh not implemented in backend');
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


  getCurrentUser() {
    return this.currentUser;
  }


  isAuthenticated() {
    return storageService.isAuthenticated() && this.currentUser !== null;
  }

  hasRole(role) {
    return this.currentUser?.rol === role;
  }


  isAdmin() {
    return this.hasRole(this.ROLES.ADMIN);
  }

  isConsumer() {
    return this.hasRole(this.ROLES.CONSUMER);
  }

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


  async getUserProfile() {
    try {
      const userId = this.currentUser?.id;
      
      if (!userId) {
        throw new Error('No authenticated user');
      }

      logger.debug('AuthService: Fetching user profile');

      const user = await UsuariosAPI.get(userId);

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


  async updateProfile(userData) {
    try {
      const userId = this.currentUser?.id;
      
      if (!userId) {
        throw new Error('No authenticated user');
      }

      logger.info('AuthService: Updating user profile');

      const user = await UsuariosAPI.patch(userId, userData);

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

export const authService = AuthService.getInstance();
export default authService;
