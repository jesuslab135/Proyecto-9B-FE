import { useEffect, useRef, useState, useCallback } from 'react';
import { logger } from '../services/Logger';

/**
 * Generic WebSocket hook for real-time connections
 * 
 * @param {string} url - WebSocket URL (e.g., 'ws://localhost:8000/ws/desires/1/')
 * @param {object} options - Configuration options
 * @param {function} options.onMessage - Callback when message received
 * @param {function} options.onConnect - Callback when connection established
 * @param {function} options.onDisconnect - Callback when connection closed
 * @param {boolean} options.reconnect - Enable auto-reconnect (default: true)
 * @param {number} options.maxReconnectAttempts - Max reconnection attempts (default: 5)
 * @param {number} options.reconnectDelay - Delay between reconnects in ms (default: 3000)
 * @param {boolean} options.enabled - Enable WebSocket connection (default: true)
 */
export function useWebSocket(url, options = {}) {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const isConnectingRef = useRef(false);
  const pingIntervalRef = useRef(null);

  const { 
    onMessage, 
    onConnect, 
    onDisconnect,
    reconnect = true,
    maxReconnectAttempts = 2,
    reconnectDelay = 5000,
    enabled = true
  } = options;

  // Store callbacks in refs to avoid recreating connect function
  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);

  // Update refs when callbacks change
  useEffect(() => {
    onMessageRef.current = onMessage;
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
  }, [onMessage, onConnect, onDisconnect]);

  const connect = useCallback(() => {
    if (!url || !enabled) {
      logger.debug('WebSocket not enabled or URL missing');
      return;
    }

    // Prevent multiple simultaneous connections
    if (isConnectingRef.current) {
      logger.debug('⏸️ Connection already in progress, skipping...');
      return;
    }

    // If already connected, skip
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      logger.debug('✅ WebSocket already connected, skipping...');
      return;
    }

    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close();
    }

    isConnectingRef.current = true;

    try {
      logger.info('🔌 Connecting WebSocket:', url);
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        logger.info(`✅ WebSocket connected: ${url}`);
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        isConnectingRef.current = false;
        
        // Send ping every 30 seconds to keep connection alive
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);
        
        if (onConnectRef.current) onConnectRef.current();
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          // Ignore pong messages
          if (message.type === 'pong') return;
          
          logger.debug('📨 WebSocket message received:', message.type);
          setData(message);
          
          if (onMessageRef.current) onMessageRef.current(message);
        } catch (err) {
          logger.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (error) => {
        // Solo loggear en el primer intento para no saturar consola
        if (reconnectAttemptsRef.current === 0) {
          logger.warn('⚠️ WebSocket connection failed, using API REST fallback');
        }
        setError(error);
        isConnectingRef.current = false;
      };

      ws.onclose = (event) => {
        // Solo loggear desconexiones en el primer intento
        if (reconnectAttemptsRef.current === 0) {
          logger.warn(`🔌 WebSocket disconnected: ${url}`, event.code);
        }
        setIsConnected(false);
        isConnectingRef.current = false;
        
        // Clear ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
        
        if (onDisconnectRef.current) onDisconnectRef.current();

        // Don't reconnect on normal closure (code 1000) without reason
        if (event.code === 1000 && !event.reason) {
          logger.debug('👋 Normal closure, not reconnecting');
          return;
        }

        // Attempt to reconnect
        if (reconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(reconnectDelay * Math.pow(2, reconnectAttemptsRef.current), 30000);
          reconnectAttemptsRef.current += 1;
          
          logger.debug(
            `🔄 Reconnect attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts} in ${delay}ms`
          );
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          logger.debug('⏸️ WebSocket not available, using API REST fallback');
          setError(new Error('WebSocket unavailable'));
        }
      };
    } catch (err) {
      logger.error('Error creating WebSocket:', err);
      setError(err);
      isConnectingRef.current = false;
    }
  }, [url, enabled, reconnect, maxReconnectAttempts, reconnectDelay]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    
    setIsConnected(false);
    isConnectingRef.current = false;
  }, []);

  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    logger.warn('WebSocket is not connected');
    return false;
  }, []);

  useEffect(() => {
    if (enabled && url) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [enabled, url, connect, disconnect]);

  return {
    data,
    isConnected,
    error,
    sendMessage,
    reconnect: connect,
    disconnect
  };
}
