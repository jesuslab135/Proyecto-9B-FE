import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { wsService } from '../services/WebSocketService';
import { DashboardAPI } from '../utils/api/dashboard.client';
import { logger } from '../services/Logger';
import authService from '../services/AuthService';

/**
 * Hook genérico para datos en tiempo real con WebSocket + API fallback
 * 
 * @param {string} channel - Canal WebSocket (sensor_data, heart_rate, desires, etc.)
 * @param {string} queryKey - Key para react-query cache
 * @param {function} apiFallback - Función API de fallback
 * @param {number} consumidorId - ID del consumidor
 * @param {object} options - Opciones adicionales
 */
const useDashboardWebSocket = (channel, queryKey, apiFallback, consumidorId, options = {}) => {
  const [realtimeData, setRealtimeData] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const queryClient = useQueryClient();
  const wsInitialized = useRef(false);
  const lastUpdate = useRef(Date.now());

  const {
    enabled = true,
    updateInterval = 5000, // Actualizar datos cada 5 segundos desde API si WS falla
    transform = (data) => data, // Transformar datos recibidos
  } = options;

  // Query API como fallback
  const queryResult = useQuery({
    queryKey: [queryKey, consumidorId || 'all'],
    queryFn: () => apiFallback(consumidorId ? { consumidor_id: consumidorId } : undefined),
    enabled: enabled && !wsConnected, // Solo usar API si WebSocket no está conectado
    refetchInterval: wsConnected ? false : updateInterval,
    staleTime: wsConnected ? Infinity : 30000,
  });

  // Callback para manejar mensajes WebSocket
  const handleWebSocketMessage = useCallback((message) => {
    try {
      const transformed = transform(message);
      
      // Actualizar estado local
      setRealtimeData(transformed);
      lastUpdate.current = Date.now();
      
      // Actualizar cache de react-query para mantener sincronización
      queryClient.setQueryData([queryKey, consumidorId || 'all'], transformed);
      
      logger.debug(`📊 Real-time update [${channel}]:`, transformed);
    } catch (error) {
      logger.error(`Error processing WebSocket data [${channel}]:`, error);
    }
  }, [channel, queryKey, consumidorId, transform, queryClient]);

  // Callback para fallback a API
  const handleFallbackToAPI = useCallback(() => {
    logger.info(`🔄 Falling back to API for ${channel}`);
    setWsConnected(false);
    // React Query se encargará de refetch automáticamente
  }, [channel]);

  // Conectar WebSocket
  useEffect(() => {
    if (!enabled || wsInitialized.current) return;

    const user = authService.getCurrentUser();
    const targetConsumidorId = consumidorId || user?.consumidor_id;

    if (!targetConsumidorId) {
      logger.debug(`No consumidor_id available for channel ${channel}`);
      return;
    }

    wsInitialized.current = true;

    const initWebSocket = async () => {
      try {
        const connected = await wsService.connect(channel, targetConsumidorId);
        
        if (connected) {
          setWsConnected(true);
          logger.info(`✅ WebSocket active for ${channel}`);
          
          // Escuchar mensajes
          wsService.on(channel, targetConsumidorId, 'message', handleWebSocketMessage);
          wsService.on(channel, targetConsumidorId, 'fallback_to_api', handleFallbackToAPI);
          
          // Solicitar datos iniciales
          wsService.send(channel, targetConsumidorId, { 
            type: 'request_data',
            timestamp: Date.now()
          });
        } else {
          logger.info(`📡 Using API REST for ${channel}`);
          setWsConnected(false);
        }
      } catch {
        logger.debug(`WebSocket connection failed for ${channel}, using API`);
        setWsConnected(false);
      }
    };

    initWebSocket();

    // Cleanup
    return () => {
      if (targetConsumidorId) {
        wsService.off(channel, targetConsumidorId, 'message', handleWebSocketMessage);
        wsService.off(channel, targetConsumidorId, 'fallback_to_api', handleFallbackToAPI);
        wsService.disconnect(channel, targetConsumidorId);
      }
      wsInitialized.current = false;
    };
  }, [enabled, channel, consumidorId, handleWebSocketMessage, handleFallbackToAPI]);

  // Determinar qué datos retornar
  const data = wsConnected && realtimeData ? realtimeData : queryResult.data;
  const isLoading = wsConnected ? !realtimeData : queryResult.isLoading;
  const error = wsConnected ? null : queryResult.error;

  return {
    data,
    isLoading,
    error,
    isConnected: wsConnected,
    isRealtime: wsConnected && realtimeData !== null,
    lastUpdate: lastUpdate.current,
    refetch: queryResult.refetch,
  };
};

// ============= HOOKS ESPECÍFICOS PARA CADA ENDPOINT =============

/**
 * Datos de sensores en tiempo real
 */
export const useSensorData = (consumidorId) => {
  return useDashboardWebSocket(
    'sensor-data',
    'dash_sensorData',
    DashboardAPI.sensorData,
    consumidorId,
    {
      transform: (message) => {
        // Si el mensaje tiene la estructura esperada
        if (message.type === 'sensor_update' && message.data) {
          return message.data;
        }
        return message;
      }
    }
  );
};

/**
 * Frecuencia cardíaca de hoy en tiempo real
 */
export const useHeartRateToday = (consumidorId) => {
  return useDashboardWebSocket(
    'heart-rate-today',
    'dash_hrToday',
    DashboardAPI.heartRateToday,
    consumidorId,
    {
      transform: (message) => {
        if (message.type === 'heart_rate_update' && message.data) {
          return message.data;
        }
        return message;
      }
    }
  );
};

/**
 * Estadísticas de frecuencia cardíaca
 */
export const useHeartRateStats = (consumidorId) => {
  return useDashboardWebSocket(
    'heart-rate-stats',
    'dash_hrStats',
    DashboardAPI.heartRateStats,
    consumidorId,
    {
      updateInterval: 5000, // Actualizar cada 10s
      transform: (message) => {
        if (message.type === 'heart_rate_stats_update' && message.data) {
          return message.data;
        }
        return message;
      }
    }
  );
};

/**
 * Timeline de frecuencia cardíaca (ventanas)
 */
export const useHeartRate = (consumidorId) => {
  return useDashboardWebSocket(
    'heart-rate',
    'dash_hr',
    DashboardAPI.heartRate,
    consumidorId,
    {
      transform: (message) => {
        if (message.type === 'heart_rate_timeline_update' && message.data) {
          return message.data;
        }
        return message;
      }
    }
  );
};

/**
 * Seguimiento de deseos en tiempo real
 */
export const useDesiresTracking = (consumidorId) => {
  return useDashboardWebSocket(
    'desires-tracking',
    'dash_dTrack',
    DashboardAPI.desiresTracking,
    consumidorId,
    {
      transform: (message) => {
        if (message.type === 'desire_update' && message.data) {
          return message.data;
        }
        return message;
      }
    }
  );
};

/**
 * Estadísticas de deseos
 */
export const useDesiresStats = (consumidorId) => {
  return useDashboardWebSocket(
    'desires-stats',
    'dash_dStats',
    DashboardAPI.desiresStats,
    consumidorId,
    {
      updateInterval: 5000,
      transform: (message) => {
        if (message.type === 'desire_stats_update' && message.data) {
          return message.data;
        }
        return message;
      }
    }
  );
};

/**
 * Timeline de predicciones
 */
export const usePredictionTimeline = (consumidorId) => {
  return useDashboardWebSocket(
    'prediction-timeline',
    'dash_predTL',
    DashboardAPI.predictionTimeline,
    consumidorId,
    {
      transform: (message) => {
        if (message.type === 'prediction_update' && message.data) {
          return message.data;
        }
        return message;
      }
    }
  );
};

/**
 * Resumen de predicciones
 */
export const usePredictionSummary = (consumidorId) => {
  return useDashboardWebSocket(
    'prediction-summary',
    'dash_predSum',
    DashboardAPI.predictionSummary,
    consumidorId,
    {
      updateInterval: 5000,
      transform: (message) => {
        if (message.type === 'prediction_summary_update' && message.data) {
          return message.data;
        }
        return message;
      }
    }
  );
};

/**
 * Resumen diario
 */
export const useDailySummary = (consumidorId) => {
  return useDashboardWebSocket(
    'daily-summary',
    'dash_daily',
    DashboardAPI.dailySummary,
    consumidorId,
    {
      updateInterval: 5000, // Actualizar cada 30s
      transform: (message) => {
        if (message.type === 'daily_summary_update' && message.data) {
          return message.data;
        }
        return message;
      }
    }
  );
};

/**
 * Comparación semanal
 */
export const useWeeklyComparison = (consumidorId) => {
  return useDashboardWebSocket(
    'weekly-comparison',
    'dash_weekly',
    DashboardAPI.weeklyComparison,
    consumidorId,
    {
      updateInterval: 60000, // Actualizar cada minuto
      transform: (message) => {
        if (message.type === 'weekly_comparison_update' && message.data) {
          return message.data;
        }
        return message;
      }
    }
  );
};

/**
 * Ventana activa actual
 */
export const useActiveWindow = (consumidorId) => {
  return useDashboardWebSocket(
    'active-window',
    'dash_activeWindow',
    DashboardAPI.activeWindow,
    consumidorId,
    {
      transform: (message) => {
        if (message.type === 'active_window_update' && message.data) {
          return message.data;
        }
        return message;
      }
    }
  );
};

/**
 * Estadísticas de hábitos
 */
export const useHabitStats = (consumidorId) => {
  return useDashboardWebSocket(
    'habit-stats',
    'dash_habitStats',
    DashboardAPI.habitStats,
    consumidorId,
    {
      updateInterval: 30000,
      transform: (message) => {
        if (message.type === 'habit_stats_update' && message.data) {
          return message.data;
        }
        return message;
      }
    }
  );
};

/**
 * Seguimiento de hábitos
 */
export const useHabitTracking = (consumidorId) => {
  return useDashboardWebSocket(
    'habit-tracking',
    'dash_habitTrack',
    DashboardAPI.habitTracking,
    consumidorId,
    {
      transform: (message) => {
        if (message.type === 'habit_update' && message.data) {
          return message.data;
        }
        return message;
      }
    }
  );
};

export default useDashboardWebSocket;
