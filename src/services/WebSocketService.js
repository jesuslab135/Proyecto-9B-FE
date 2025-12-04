import { logger } from './Logger';
import { storageService } from './StorageService';

/**
 * WebSocket Service con gestión de múltiples canales, reconexión automática
 * y fallback a API REST
 */
class WebSocketService {
  constructor() {
    this.connections = new Map(); // Map<channelName, WebSocketConnection>
    this.reconnectAttempts = new Map();
    this.listeners = new Map(); // Map<channelName, Map<event, callbacks[]>>
    this.maxReconnectAttempts = 3;
    this.reconnectDelay = 3000;
    this.isEnabled = true;
    this.baseWsUrl = 'wss://backend9b-production.up.railway.app/ws';
    
    // Intentar conectar, pero no es crítico
    this._checkWebSocketAvailability();
  }

  /**
   * Verificar si el servidor WebSocket está disponible
   * No bloqueante, solo para logging
   */
  async _checkWebSocketAvailability() {
    // No hacer nada crítico aquí, solo marcar disponibilidad
    logger.info('WebSocketService: Initialized');
  }

  /**
   * Conectar a un canal WebSocket específico
   * @param {string} channel - Nombre del canal (sensor_data, heart_rate, desires, etc.)
   * @param {number} consumidorId - ID del consumidor
   * @returns {Promise<boolean>} - True si la conexión fue exitosa
   */
  async connect(channel, consumidorId) {
    if (!this.isEnabled) {
      logger.debug(`WebSocket disabled, using API REST for ${channel}`);
      return false;
    }

    const channelKey = `${channel}_${consumidorId}`;
    
    // Si ya existe una conexión activa, no crear otra
    if (this.connections.has(channelKey)) {
      const ws = this.connections.get(channelKey);
      if (ws.readyState === WebSocket.OPEN) {
        logger.debug(`✅ WebSocket already connected: ${channelKey}`);
        return true;
      }
    }

    const token = storageService.getToken();
    if (!token) {
      logger.warn('No authentication token found');
      return false;
    }

    const wsUrl = `${this.baseWsUrl}/${channel}/${consumidorId}/?token=${token}`;
    
    try {
      const ws = new WebSocket(wsUrl);
      const connectionPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 5000);

        ws.onopen = () => {
          clearTimeout(timeout);
          logger.info(`✅ WebSocket connected: ${channelKey}`);
          this.reconnectAttempts.set(channelKey, 0);
          
          // Setup heartbeat
          this._setupHeartbeat(ws);
          
          resolve(true);
        };

        ws.onerror = () => {
          clearTimeout(timeout);
          // Silencioso: el backend no tiene WebSocket configurado
          reject(new Error('WebSocket not available'));
        };
      });

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Ignorar pongs
          if (data.type === 'pong') return;
          
          logger.debug(`📨 WebSocket message [${channelKey}]:`, data.type);
          this._emit(channelKey, data.type, data);
          
          // También emitir evento genérico
          this._emit(channelKey, 'message', data);
        } catch (err) {
          logger.error(`Error parsing WebSocket message [${channelKey}]:`, err);
        }
      };

      ws.onclose = (event) => {
        this.connections.delete(channelKey);
        
        // Cleanup heartbeat
        if (ws._heartbeatInterval) {
          clearInterval(ws._heartbeatInterval);
        }
        
        // No reconectar si fue cierre normal o error 404
        if (event.code === 1000 || event.code === 1006) {
          return;
        }
        
        // Intentar reconectar solo si no fue error 404
        this._handleReconnect(channel, consumidorId, channelKey);
      };

      this.connections.set(channelKey, ws);
      
      await connectionPromise;
      return true;
    } catch {
      // Silencioso: fallback a API REST es automático
      this.connections.delete(channelKey);
      return false;
    }
  }

  /**
   * Configurar heartbeat para mantener conexión viva
   */
  _setupHeartbeat(ws) {
    ws._heartbeatInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Cada 30 segundos
  }

  /**
   * Manejar reconexión automática
   */
  _handleReconnect(channel, consumidorId, channelKey) {
    const attempts = this.reconnectAttempts.get(channelKey) || 0;
    
    if (attempts >= this.maxReconnectAttempts) {
      // Silencioso: ya sabemos que no hay WebSocket
      this._emit(channelKey, 'fallback_to_api', { channel, consumidorId });
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, attempts);
    this.reconnectAttempts.set(channelKey, attempts + 1);
    
    // Solo loguear en desarrollo
    if (import.meta.env.DEV) {
      logger.debug(`🔄 Reconnecting ${channelKey} (${attempts + 1}/${this.maxReconnectAttempts})`);
    }
    
    setTimeout(() => {
      this.connect(channel, consumidorId);
    }, delay);
  }

  /**
   * Suscribirse a eventos de un canal
   * @param {string} channel - Nombre del canal
   * @param {number} consumidorId - ID del consumidor
   * @param {string} event - Tipo de evento
   * @param {function} callback - Función a ejecutar
   */
  on(channel, consumidorId, event, callback) {
    const channelKey = `${channel}_${consumidorId}`;
    
    if (!this.listeners.has(channelKey)) {
      this.listeners.set(channelKey, new Map());
    }
    
    const channelListeners = this.listeners.get(channelKey);
    
    if (!channelListeners.has(event)) {
      channelListeners.set(event, []);
    }
    
    channelListeners.get(event).push(callback);
  }

  /**
   * Desuscribirse de eventos
   */
  off(channel, consumidorId, event, callback) {
    const channelKey = `${channel}_${consumidorId}`;
    
    if (!this.listeners.has(channelKey)) return;
    
    const channelListeners = this.listeners.get(channelKey);
    
    if (!channelListeners.has(event)) return;
    
    const callbacks = channelListeners.get(event);
    const index = callbacks.indexOf(callback);
    
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * Emitir evento a todos los listeners
   */
  _emit(channelKey, event, data) {
    if (!this.listeners.has(channelKey)) return;
    
    const channelListeners = this.listeners.get(channelKey);
    
    if (!channelListeners.has(event)) return;
    
    const callbacks = channelListeners.get(event);
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        logger.error(`Error in WebSocket callback [${channelKey}/${event}]:`, error);
      }
    });
  }

  /**
   * Enviar mensaje a través del WebSocket
   */
  send(channel, consumidorId, message) {
    const channelKey = `${channel}_${consumidorId}`;
    const ws = this.connections.get(channelKey);
    
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      logger.warn(`WebSocket not connected for ${channelKey}`);
      return false;
    }
    
    try {
      ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      logger.error(`Error sending WebSocket message [${channelKey}]:`, error);
      return false;
    }
  }

  /**
   * Desconectar un canal específico
   */
  disconnect(channel, consumidorId) {
    const channelKey = `${channel}_${consumidorId}`;
    const ws = this.connections.get(channelKey);
    
    if (ws) {
      if (ws._heartbeatInterval) {
        clearInterval(ws._heartbeatInterval);
      }
      ws.close(1000, 'Manual disconnect');
      this.connections.delete(channelKey);
      this.listeners.delete(channelKey);
      this.reconnectAttempts.delete(channelKey);
      logger.info(`🔌 Disconnected WebSocket: ${channelKey}`);
    }
  }

  /**
   * Desconectar todos los canales
   */
  disconnectAll() {
    logger.info('🔌 Disconnecting all WebSocket connections');
    this.connections.forEach((ws) => {
      if (ws._heartbeatInterval) {
        clearInterval(ws._heartbeatInterval);
      }
      ws.close(1000, 'Disconnect all');
    });
    this.connections.clear();
    this.listeners.clear();
    this.reconnectAttempts.clear();
  }

  /**
   * Verificar si un canal está conectado
   */
  isConnected(channel, consumidorId) {
    const channelKey = `${channel}_${consumidorId}`;
    const ws = this.connections.get(channelKey);
    return ws && ws.readyState === WebSocket.OPEN;
  }

  /**
   * Obtener estadísticas de conexiones
   */
  getStats() {
    const stats = {
      totalConnections: this.connections.size,
      activeConnections: 0,
      channels: []
    };

    this.connections.forEach((ws, channelKey) => {
      const isActive = ws.readyState === WebSocket.OPEN;
      if (isActive) stats.activeConnections++;
      
      stats.channels.push({
        channel: channelKey,
        state: ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][ws.readyState],
        isActive
      });
    });

    return stats;
  }

  /**
   * Deshabilitar WebSocket globalmente (usar solo API REST)
   */
  disable() {
    this.isEnabled = false;
    this.disconnectAll();
    logger.info('WebSocketService disabled - using API REST only');
  }

  /**
   * Habilitar WebSocket
   */
  enable() {
    this.isEnabled = true;
    logger.info('WebSocketService enabled');
  }
}

// Exportar instancia singleton
export const wsService = new WebSocketService();
export default wsService;
