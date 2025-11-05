
import { logger } from './Logger';

class StorageService {
  static instance = null;

  constructor() {
    if (StorageService.instance) {
      return StorageService.instance;
    }

    this.KEYS = {
      TOKEN: 'auth_token',
      REFRESH_TOKEN: 'refresh_token',
      USER: 'user_data',
      TOKEN_EXPIRY: 'token_expiry',
    };

    StorageService.instance = this;
  }

  static getInstance() {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }


  _setItem(key, value) {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
      logger.debug(`StorageService: Set ${key}`);
      return true;
    } catch (error) {
      logger.error(`StorageService: Failed to set ${key}`, error);
      return false;
    }
  }


  _getItem(key, parse = false) {
    try {
      const value = localStorage.getItem(key);
      if (!value) return null;
      
      return parse ? JSON.parse(value) : value;
    } catch (error) {
      logger.error(`StorageService: Failed to get ${key}`, error);
      return null;
    }
  }


  _removeItem(key) {
    try {
      localStorage.removeItem(key);
      logger.debug(`StorageService: Removed ${key}`);
      return true;
    } catch (error) {
      logger.error(`StorageService: Failed to remove ${key}`, error);
      return false;
    }
  }


  setToken(token, expiresIn = null) {
    const success = this._setItem(this.KEYS.TOKEN, token);
    
    if (success && expiresIn) {
      const expiryTime = Date.now() + (expiresIn * 1000); // Convert seconds to milliseconds
      this._setItem(this.KEYS.TOKEN_EXPIRY, expiryTime.toString());
    }
    
    return success;
  }


  getToken() {
    return this._getItem(this.KEYS.TOKEN);
  }


  isTokenExpired() {
    const expiry = this._getItem(this.KEYS.TOKEN_EXPIRY);
    if (!expiry) return false;
    
    return Date.now() > parseInt(expiry, 10);
  }


  setRefreshToken(token) {
    return this._setItem(this.KEYS.REFRESH_TOKEN, token);
  }


  getRefreshToken() {
    return this._getItem(this.KEYS.REFRESH_TOKEN);
  }


  setUser(userData) {
    return this._setItem(this.KEYS.USER, userData);
  }


  getUser() {
    return this._getItem(this.KEYS.USER, true);
  }


  clearAuth() {
    logger.info('StorageService: Clearing authentication data');
    this._removeItem(this.KEYS.TOKEN);
    this._removeItem(this.KEYS.REFRESH_TOKEN);
    this._removeItem(this.KEYS.USER);
    this._removeItem(this.KEYS.TOKEN_EXPIRY);
  }


  isAuthenticated() {
    const token = this.getToken();
    const isExpired = this.isTokenExpired();
    
    return token && !isExpired;
  }


  getUserRole() {
    const user = this.getUser();
    return user?.rol || null;
  }
}

export const storageService = StorageService.getInstance();
export default storageService;
