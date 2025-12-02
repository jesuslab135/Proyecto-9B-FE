import { useState, useEffect } from "react";
import { authService } from "../../services/AuthService";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useHeartRateToday, useHeartRateStats } from "../../hooks/useDashboard";
import { API } from "../../utils/api/endpoints";  // ✅ Importar API config
import "./DashboardHR.css";

export default function DashboardHR() {
  const user = authService.getCurrentUser();
  const consumidorId = user?.consumidor_id || 1;
  
  const [hrData, setHrData] = useState(null);
  
  // ✅ WebSocket habilitado - Usar API REST solo si WebSocket falla
  const USE_WEBSOCKET = true;
  
  // Fallback: API REST (solo si WebSocket deshabilitado)
  const { data: todayData } = useHeartRateToday(consumidorId);
  const { data: statsData } = useHeartRateStats(consumidorId);
  
  // ✅ WebSocket connection usando URL centralizada
  const { isConnected, error: wsError } = useWebSocket(
    API.websockets.heartRate(consumidorId),
    {
      enabled: USE_WEBSOCKET,
      maxReconnectAttempts: 2,
      reconnectDelay: 5000,
      onMessage: (message) => {
        
        if (message.type === 'initial_data') {
          setHrData(message.data);
        } else if (message.type === 'hr_update') {
          setHrData(prev => {
            if (!prev) return { ventanas: [message.data], stats: {}, promedio_dia: null };
            
            const ventanas = prev.ventanas || [];
            const existingIndex = ventanas.findIndex(
              v => v.id === message.data.ventana_id
            );
            
            if (existingIndex >= 0) {
              ventanas[existingIndex] = {
                ...ventanas[existingIndex],
                heart_rate_mean: message.data.hr_mean,
                heart_rate_std: message.data.hr_std,
              };
            } else {
              ventanas.unshift({
                id: message.data.ventana_id,
                window_start: message.data.window_start,
                window_end: message.data.window_end,
                heart_rate_mean: message.data.hr_mean,
                heart_rate_std: message.data.hr_std,
              });
            }
            
            return { ...prev, ventanas };
          });
        }
      }
    }
  );
  
  // Actualizar desde API REST cuando WebSocket deshabilitado O falla
  useEffect(() => {
    if ((!USE_WEBSOCKET || wsError) && todayData && statsData) {
      setHrData({
        ventanas: todayData.ventanas || [],
        promedio_dia: todayData.promedio_dia,
        stats: {
          promedio: statsData.hr_promedio_general,
          minimo: statsData.hr_minimo,
          maximo: statsData.hr_maximo,
          desviacion: statsData.hr_desviacion
        }
      });
    }
  }, [todayData, statsData, USE_WEBSOCKET, wsError]);

  // No mostrar error si tenemos fallback de API REST funcionando

  if (!hrData) {
    return (
      <div className="hr-loading">
        <p>⏳ Conectando a datos de frecuencia cardíaca...</p>
      </div>
    );
  }

  const { ventanas = [], promedio_dia, stats = {} } = hrData;

  return (
    <div className="dashboard-hr-container">
      {/* Stats Header */}
      <div className="hr-stats-header">
        <h4>Frecuencia cardíaca</h4>
        {USE_WEBSOCKET && (
          <div className={`live-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            <div className={`pulse-dot ${isConnected ? 'active' : ''}`}></div>
            <span>{isConnected ? 'EN VIVO' : 'DESCONECTADO'}</span>
          </div>
        )}
      </div>

      <div className="hr-stats-values">
        <div className="hr-stat-item">
          <div className="hr-stat-label">Promedio</div>
          <div className="hr-stat-value">
            {stats.promedio ? Math.round(stats.promedio) : '–'}
          </div>
        </div>
        <div className="hr-stat-item">
          <div className="hr-stat-label">Mínimo</div>
          <div className="hr-stat-value">
            {stats.minimo ? Math.round(stats.minimo) : '–'}
          </div>
        </div>
        <div className="hr-stat-item">
          <div className="hr-stat-label">Máximo</div>
          <div className="hr-stat-value">
            {stats.maximo ? Math.round(stats.maximo) : '–'}
          </div>
        </div>
        <div className="hr-stat-item">
          <div className="hr-stat-label">Std</div>
          <div className="hr-stat-value">
            {stats.desviacion ? Math.round(stats.desviacion) : '–'}
          </div>
        </div>
      </div>

      {/* Today Section */}
      <div className="hr-today-section">
        <h5>Hoy</h5>
        <div className="hr-today-value">
          <span className="hr-today-number">
            {promedio_dia ? Math.round(promedio_dia) : '–'}
          </span>
          <span className="hr-today-label">HR prom</span>
        </div>
      </div>

      {/* Timeline Table */}
      <div className="hr-table-wrapper">
        <div className="hr-table-scroll">
          <table className="hr-table">
            <thead>
              <tr>
                <th>Inicio</th>
                <th>Fin</th>
                <th>HR μ</th>
                <th>HR σ</th>
              </tr>
            </thead>
            <tbody>
              {ventanas.length > 0 ? (
                ventanas.map((x, i) => (
                  <tr key={i} style={{
                    opacity: (x.heart_rate_mean === null || x.heart_rate_mean === undefined) ? 0.5 : 1
                  }}>
                    <td>{new Date(x.window_start).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</td>
                    <td>{new Date(x.window_end).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</td>
                    <td style={{
                      color: (x.heart_rate_mean === null || x.heart_rate_mean === undefined) ? '#999' : '#263238'
                    }}>
                      {x.heart_rate_mean ? Math.round(x.heart_rate_mean) : 'Sin datos'}
                    </td>
                    <td style={{
                      color: (x.heart_rate_std === null || x.heart_rate_std === undefined) ? '#999' : '#263238'
                    }}>
                      {x.heart_rate_std ? x.heart_rate_std.toFixed(2) : 'Sin datos'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="hr-empty">
                    No hay ventanas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
