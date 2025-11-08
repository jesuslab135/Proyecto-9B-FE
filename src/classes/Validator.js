/**
 * Validator class - Implements validation logic using Strategy pattern
 */
import {
  MSG_REQUIRED_FIELD,
  MSG_INVALID_NUMBER,
  MSG_MIN_VALUE,
  MSG_MAX_VALUE,
} from '../constants/formConstants';

export class Validator {
  /**
   * Validate required field
   */
  static validateRequired(value) {
    if (!value || value.toString().trim() === '') {
      return MSG_REQUIRED_FIELD;
    }
    return null;
  }

  /**
   * Validate number field
   */
  static validateNumber(value) {
    const num = Number(value);
    if (isNaN(num)) {
      return MSG_INVALID_NUMBER;
    }
    return null;
  }

  /**
   * Validate range
   */
  static validateRange(value, min, max) {
    const num = Number(value);
    if (num < min) {
      return `${MSG_MIN_VALUE} (mínimo: ${min})`;
    }
    if (num > max) {
      return `${MSG_MAX_VALUE} (máximo: ${max})`;
    }
    return null;
  }

  /**
   * Validate field based on configuration
   */
  static validateField(value, fieldConfig) {
    // Required validation
    const requiredError = this.validateRequired(value);
    if (requiredError) return requiredError;

    // Number validation for numeric fields
    if (fieldConfig.type === 'number') {
      const numberError = this.validateNumber(value);
      if (numberError) return numberError;

      // Range validation
      if (fieldConfig.min !== undefined && fieldConfig.max !== undefined) {
        const rangeError = this.validateRange(value, fieldConfig.min, fieldConfig.max);
        if (rangeError) return rangeError;
      }
    }

    return null;
  }

  /**
   * Validate all fields
   */
  static validateFields(formData, fieldConfigs) {
    const errors = {};
    let isValid = true;

    fieldConfigs.forEach((fieldConfig) => {
      const value = formData.getField(fieldConfig.id);
      const error = this.validateField(value, fieldConfig);
      
      if (error) {
        errors[fieldConfig.id] = error;
        formData.setError(fieldConfig.id, error);
        isValid = false;
      }
    });

    return { isValid, errors };
  }
}
