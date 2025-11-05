/**
 * Logger Service - Singleton Pattern
 * Provides centralized logging for frontend with multiple log levels
 * Prevents application crashes by catching and logging errors gracefully
 */

class Logger {
  static instance = null;

  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }

    this.logs = [];
    this.maxLogs = 1000; // Maximum logs to keep in memory
    this.isDevelopment = import.meta.env.MODE === 'development';
    
    Logger.instance = this;
  }

  /**
   * Get singleton instance
   */
  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Format log message with timestamp
   */
  _formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      message,
      data,
      userAgent: navigator.userAgent,
    };
  }

  /**
   * Store log in memory
   */
  _storeLog(logEntry) {
    this.logs.push(logEntry);
    
    // Keep only last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // In production, you might want to send critical errors to a service
    if (!this.isDevelopment && logEntry.level === 'ERROR') {
      this._sendToServer(logEntry);
    }
  }

  /**
   * Send error logs to backend (optional)
   */
  async _sendToServer(logEntry) {
    try {
      // Implement backend logging endpoint if needed
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry)
      // });
      console.log('Log entry:', logEntry); // Placeholder to avoid unused param warning
    } catch (error) {
      // Silent fail - don't crash if logging fails
      console.error('Failed to send log to server:', error);
    }
  }

  /**
   * Log info level message
   */
  info(message, data = null) {
    const logEntry = this._formatMessage('INFO', message, data);
    this._storeLog(logEntry);
    
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, data || '');
    }
  }

  /**
   * Log warning level message
   */
  warn(message, data = null) {
    const logEntry = this._formatMessage('WARN', message, data);
    this._storeLog(logEntry);
    
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }

  /**
   * Log error level message
   */
  error(message, error = null) {
    const errorData = error ? {
      message: error.message,
      stack: error.stack,
      name: error.name,
    } : null;

    const logEntry = this._formatMessage('ERROR', message, errorData);
    this._storeLog(logEntry);
    
    console.error(`[ERROR] ${message}`, error || '');
  }

  /**
   * Log debug level message (only in development)
   */
  debug(message, data = null) {
    if (this.isDevelopment) {
      const logEntry = this._formatMessage('DEBUG', message, data);
      this._storeLog(logEntry);
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  }

  /**
   * Get all stored logs
   */
  getLogs(level = null) {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = [];
    this.info('Logs cleared');
  }

  /**
   * Export logs as JSON
   */
  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
export default logger;
