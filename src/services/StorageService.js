/**
 * StorageService - Singleton Pattern
 * Manages secure storage of authentication tokens and user data
 * Handles localStorage with error handling and data validation
 */

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

  /**
   * Get singleton instance
   */
  static getInstance() {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * Safely set item in localStorage
   */
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

  /**
   * Safely get item from localStorage
   */
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

  /**
   * Safely remove item from localStorage
   */
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

  /**
   * Save authentication token
   */
  setToken(token, expiresIn = null) {
    const success = this._setItem(this.KEYS.TOKEN, token);
    
    if (success && expiresIn) {
      const expiryTime = Date.now() + (expiresIn * 1000); // Convert seconds to milliseconds
      this._setItem(this.KEYS.TOKEN_EXPIRY, expiryTime.toString());
    }
    
    return success;
  }

  /**
   * Get authentication token
   */
  getToken() {
    return this._getItem(this.KEYS.TOKEN);
  }

  /**
   * Check if token is expired
   */
  isTokenExpired() {
    const expiry = this._getItem(this.KEYS.TOKEN_EXPIRY);
    if (!expiry) return false;
    
    return Date.now() > parseInt(expiry, 10);
  }

  /**
   * Save refresh token
   */
  setRefreshToken(token) {
    return this._setItem(this.KEYS.REFRESH_TOKEN, token);
  }

  /**
   * Get refresh token
   */
  getRefreshToken() {
    return this._getItem(this.KEYS.REFRESH_TOKEN);
  }

  /**
   * Save user data
   */
  setUser(userData) {
    return this._setItem(this.KEYS.USER, userData);
  }

  /**
   * Get user data
   */
  getUser() {
    return this._getItem(this.KEYS.USER, true);
  }

  /**
   * Clear all authentication data
   */
  clearAuth() {
    logger.info('StorageService: Clearing authentication data');
    this._removeItem(this.KEYS.TOKEN);
    this._removeItem(this.KEYS.REFRESH_TOKEN);
    this._removeItem(this.KEYS.USER);
    this._removeItem(this.KEYS.TOKEN_EXPIRY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const token = this.getToken();
    const isExpired = this.isTokenExpired();
    
    return token && !isExpired;
  }

  /**
   * Get user role
   */
  getUserRole() {
    const user = this.getUser();
    return user?.rol || null;
  }
}

// Export singleton instance
export const storageService = StorageService.getInstance();
export default storageService;
