import { useState, useEffect, useCallback, useRef } from 'react';
import { authService } from '../services/AuthService';
import { logger } from '../services/Logger';
import { NotificacionesAPI } from '../utils/api/notificaciones.client';
import { API } from '../utils/api/endpoints';

/**
 * Hook para manejar notificaciones con WebSocket
 * Reemplaza el polling con conexión en tiempo real
 */
export function useNotifications() {
  // ⚠️ WebSocket deshabilitado temporalmente - Railway backend no tiene WS habilitado
  const USE_WEBSOCKET = false;
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [newNotifications, setNewNotifications] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const isConnectingRef = useRef(false);
  
  const user = authService.getCurrentUser();
  const consumidorId = user?.consumidor_id;
  
  // Check notification preferences from localStorage
  useEffect(() => {
    const loadPreferences = () => {
      const savedPrefs = localStorage.getItem('notificationPrefs');
      if (savedPrefs) {
        try {
          const prefs = JSON.parse(savedPrefs);
          setNotificationsEnabled(prefs.enableNotifications !== false);
          logger.debug('📋 Notification preferences loaded:', prefs.enableNotifications);
        } catch (err) {
          logger.error('Error parsing notification preferences:', err);
        }
      }
    };
    
    // Load initial preferences
    loadPreferences();
    
    // Listen for preference changes from settings page
    const handlePrefsChanged = (event) => {
      logger.info('🔄 Notification preferences changed:', event.detail);
      setNotificationsEnabled(event.detail.enableNotifications !== false);
    };
    
    window.addEventListener('notificationPrefsChanged', handlePrefsChanged);
    
    return () => {
      window.removeEventListener('notificationPrefsChanged', handlePrefsChanged);
    };
  }, []);
  
  // Conectar WebSocket
  const connect = useCallback(() => {
    // Skip WebSocket if disabled
    if (!USE_WEBSOCKET) {
      logger.info('⚠️ WebSocket disabled - using REST API fallback');
      return;
    }
    
    if (!consumidorId) {
      logger.warn('No consumidor ID available for WebSocket');
      return;
    }
    
    // Check if notifications are enabled
    if (!notificationsEnabled) {
      logger.info('🔕 Notifications disabled by user');
      
      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close(1000, 'Notifications disabled');
        wsRef.current = null;
      }
      
      // Clear notifications
      setNotifications([]);
      setUnreadCount(0);
      setIsConnected(false);
      return;
    }
    
    // Prevenir conexiones múltiples simultáneas
    if (isConnectingRef.current) {
      logger.debug('⏸️ Connection already in progress, skipping...');
      return;
    }
    
    // Si ya hay una conexión activa, no reconectar
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      logger.debug('✅ WebSocket already connected, skipping...');
      return;
    }
    
    // Si hay una conexión, cerrarla
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    isConnectingRef.current = true;
    
    try {
      // ✅ Usar URL centralizada desde endpoints
      const wsUrl = API.websockets.notifications(consumidorId);
      
      logger.info('🔌 Connecting WebSocket:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        logger.info('✅ WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        isConnectingRef.current = false;
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (err) {
          logger.error('Error parsing WebSocket message:', err);
        }
      };
      
      ws.onerror = (error) => {
        logger.error('❌ WebSocket error:', error);
        setError('Error de conexión WebSocket');
        isConnectingRef.current = false;
      };
      
      ws.onclose = (event) => {
        logger.warn('🔌 WebSocket disconnected', event.code, event.reason);
        setIsConnected(false);
        isConnectingRef.current = false;
        
        // No reconectar si fue cierre normal (código 1000) y sin razón específica
        // Esto previene reconexiones innecesarias en desarrollo con StrictMode
        if (event.code === 1000 && !event.reason) {
          logger.debug('👋 Normal closure, not reconnecting');
          return;
        }
        
        // Intentar reconectar automáticamente solo en errores
        if (reconnectAttemptsRef.current < 5) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          logger.info(`⏱️ Reconnecting in ${delay}ms...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
          }, delay);
        } else {
          setError('No se pudo conectar al servidor de notificaciones');
        }
      };
      
      wsRef.current = ws;
      
    } catch (err) {
      logger.error('Error creating WebSocket:', err);
      setError('Error al crear conexión WebSocket');
      isConnectingRef.current = false;
    }
  }, [consumidorId, notificationsEnabled]);
  
  // Manejar mensajes del WebSocket
  const handleWebSocketMessage = (data) => {
    logger.debug('📨 WebSocket message:', data);
    
    switch (data.type) {
      case 'initial_notifications': {
        // Notificaciones al conectar - solo mostrar las no leídas
        const allNotifications = data.notifications || [];
        const unreadNotifications = allNotifications.filter(n => !n.leida);
        
        setNotifications(unreadNotifications);
        setUnreadCount(unreadNotifications.length);
        
        logger.info(`📬 Initial notifications loaded: ${allNotifications.length} total, ${unreadNotifications.length} unread (showing only unread)`);
        break;
      }
        
      case 'new_notification': {
        // Nueva notificación recibida
        const newNotif = data.notification;
        logger.info('🆕 New notification received:', newNotif.tipo);
        
        setNotifications(prev => [newNotif, ...prev]);
        setUnreadCount(prev => prev + 1);
        setNewNotifications([newNotif]);
        
        // Limpiar después de 500ms
        setTimeout(() => setNewNotifications([]), 500);
        break;
      }
        
      case 'marked_read':
        // Notificación marcada como leída
        logger.info('✓ Notification marked as read:', data.notification_id);
        break;
        
      default:
        logger.warn('Unknown WebSocket message type:', data.type);
    }
  };
  
  // Marcar notificación como leída (vía WebSocket)
  const markAsRead = useCallback(async (notificationId) => {
    try {
      // Enviar por WebSocket
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'mark_read',
          notification_id: notificationId
        }));
      }
      
      // También actualizar vía API (fallback)
      await NotificacionesAPI.markRead(notificationId);
      
      // Actualizar estado local
      setNotifications(prev => 
        prev.filter(n => n.id !== notificationId)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
    } catch (err) {
      logger.error('Error marking notification as read:', err);
    }
  }, []);
  
  // Marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    try {
      const unreadIds = notifications.filter(n => !n.leida).map(n => n.id);
      
      // Marcar todas
      await Promise.all(unreadIds.map(id => NotificacionesAPI.markRead(id)));
      
      // Actualizar estado
      setNotifications([]);
      setUnreadCount(0);
      
      logger.info('✅ All notifications marked as read');
    } catch (err) {
      logger.error('Error marking all as read:', err);
    }
  }, [notifications]);
  
  // Conectar al montar y limpiar al desmontar
  useEffect(() => {
    connect();
    
    return () => {
      // Limpiar timeouts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      // Cerrar conexión solo si está abierta
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        logger.debug('🧹 Cleaning up WebSocket connection');
        wsRef.current.close(1000, 'Component unmounting');
      }
      
      isConnectingRef.current = false;
    };
  }, [connect]);
  
  // Reconnect/disconnect when notification preference changes
  useEffect(() => {
    connect();
  }, [notificationsEnabled, connect]);
  
  return {
    notifications,
    unreadCount,
    isConnected,
    error,
    newNotifications,
    notificationsEnabled,
    markAsRead,
    markAllAsRead,
    reconnect: connect,
  };
}