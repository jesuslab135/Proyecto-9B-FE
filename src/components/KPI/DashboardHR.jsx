import { useState, useEffect } from "react";
import { authService } from "../../services/AuthService";
import { useHeartRateToday, useHeartRateStats } from "../../hooks/useDashboardWebSocket";
import "./DashboardHR.css";

export default function DashboardHR() {
  const user = authService.getCurrentUser();
  const consumidorId = user?.consumidor_id || 1;
  
  const [hrData, setHrData] = useState(null);
  
  // ✅ Nuevo hooks con WebSocket + API fallback automático
  const { data: todayData, isRealtime: todayRealtime } = useHeartRateToday(consumidorId);
  const { data: statsData, isRealtime: statsRealtime } = useHeartRateStats(consumidorId);
  
  const isRealtime = todayRealtime || statsRealtime;
  
  // Actualizar desde los hooks cuando cambien los datos
  useEffect(() => {
    if (todayData && statsData) {
      // El backend devuelve todayData como array, acceder al primer elemento
      const today = Array.isArray(todayData) ? todayData[0] : todayData;
      const stats = Array.isArray(statsData) ? statsData[0] : statsData;
      
      setHrData({
        ventanas: today?.ventanas || [],
        promedio_dia: today?.promedio_dia,
        stats: {
          promedio: stats?.hr_promedio_general,
          minimo: stats?.hr_minimo,
          maximo: stats?.hr_maximo,
          desviacion: stats?.hr_desviacion
        }
      });
    }
  }, [todayData, statsData]);

  if (!hrData) {
    return (
      <div className="hr-loading">
        <p>⏳ Cargando datos de frecuencia cardíaca...</p>
      </div>
    );
  }

  const { ventanas = [], promedio_dia, stats = {} } = hrData;

  return (
    <div className="dashboard-hr-container">
      {/* Stats Header */}
      <div className="hr-stats-header">
        <h4>Frecuencia cardíaca</h4>
        <div className={`live-indicator ${hrData ? 'connected' : 'disconnected'}`}>
          <div className={`pulse-dot ${hrData ? 'active' : ''}`}></div>
          <span>
            {isRealtime ? '🔴 TIEMPO REAL' : hrData ? '📡 API REST' : 'DESCONECTADO'}
          </span>
        </div>
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
