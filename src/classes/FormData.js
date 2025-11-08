/**
 * FormData class - Manages form data using OOP principles
 */
export class FormData {
  constructor() {
    this.data = {};
    this.errors = {};
  }

  /**
   * Set a field value
   */
  setField(fieldId, value) {
    this.data[fieldId] = value;
    // Clear error when field is updated
    if (this.errors[fieldId]) {
      delete this.errors[fieldId];
    }
  }

  /**
   * Get a field value
   */
  getField(fieldId) {
    return this.data[fieldId] || '';
  }

  /**
   * Get all data
   */
  getData() {
    return { ...this.data };
  }

  /**
   * Set error for a field
   */
  setError(fieldId, errorMessage) {
    this.errors[fieldId] = errorMessage;
  }

  /**
   * Get error for a field
   */
  getError(fieldId) {
    return this.errors[fieldId] || null;
  }

  /**
   * Check if form has any errors
   */
  hasErrors() {
    return Object.keys(this.errors).length > 0;
  }

  /**
   * Clear all errors
   */
  clearErrors() {
    this.errors = {};
  }

  /**
   * Reset all data
   */
  reset() {
    this.data = {};
    this.errors = {};
  }

  /**
   * Load data from storage
   */
  loadFromStorage(storageKey) {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        this.data = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  /**
   * Save data to storage
   */
  saveToStorage(storageKey) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }
}
