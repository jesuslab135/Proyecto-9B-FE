

class Logger {
  static instance = null;

  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }

    this.logs = [];
    this.maxLogs = 1000; 
    this.isDevelopment = import.meta.env.MODE === 'development';
    
    Logger.instance = this;
  }


  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }


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


  _storeLog(logEntry) {
    this.logs.push(logEntry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (!this.isDevelopment && logEntry.level === 'ERROR') {
      this._sendToServer(logEntry);
    }
  }


  async _sendToServer(logEntry) {
    try {
      // Implement backend logging endpoint if needed
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry)
      // });
      console.log('Log entry:', logEntry); 
    } catch (error) {
      console.error('Failed to send log to server:', error);
    }
  }


  info(message, data = null) {
    const logEntry = this._formatMessage('INFO', message, data);
    this._storeLog(logEntry);
    
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, data || '');
    }
  }

  warn(message, data = null) {
    const logEntry = this._formatMessage('WARN', message, data);
    this._storeLog(logEntry);
    
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }

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

  debug(message, data = null) {
    if (this.isDevelopment) {
      const logEntry = this._formatMessage('DEBUG', message, data);
      this._storeLog(logEntry);
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  }

  getLogs(level = null) {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
    this.info('Logs cleared');
  }

  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = Logger.getInstance();
export default logger;
