import { useHeartRateToday, useHeartRateStats } from "../../hooks/useDashboard";
import { authService } from "../../services/AuthService";
import "./DashboardHR.css";

export default function DashboardHR() {
  // Obtener el usuario autenticado
  const user = authService.getCurrentUser();
  const consumidorId = 1; // Fallback a 1 si no hay usuario
  
  // Usar el nuevo endpoint que trae datos del día actual
  const { data: todayData, isLoading, error } = useHeartRateToday(consumidorId);
  const { data: kpi } = useHeartRateStats(consumidorId);

  if (isLoading) {
    return (
      <div className="hr-loading">
        <p>⏳ Cargando datos de frecuencia cardíaca...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hr-error">
        <p>❌ Error al cargar datos: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-hr-container">
      {/* Stats Header */}
      <div className="hr-stats-header">
        <h4>Frecuencia cardíaca</h4>
        <div className="hr-stats-values">
          <div className="hr-stat-item">
            <div className="hr-stat-label">Promedio</div>
            <div className="hr-stat-value">
              {kpi?.hr_promedio_general ? Math.round(kpi.hr_promedio_general) : '–'}
            </div>
          </div>
          <div className="hr-stat-item">
            <div className="hr-stat-label">Mínimo</div>
            <div className="hr-stat-value">
              {kpi?.hr_minimo ? Math.round(kpi.hr_minimo) : '–'}
            </div>
          </div>
          <div className="hr-stat-item">
            <div className="hr-stat-label">Máximo</div>
            <div className="hr-stat-value">
              {kpi?.hr_maximo ? Math.round(kpi.hr_maximo) : '–'}
            </div>
          </div>
          <div className="hr-stat-item">
            <div className="hr-stat-label">Std</div>
            <div className="hr-stat-value">
              {kpi?.hr_desviacion ? Math.round(kpi.hr_desviacion) : '–'}
            </div>
          </div>
        </div>
      </div>

      {/* Today Section */}
      <div className="hr-today-section">
        <h5>Hoy</h5>
        <div className="hr-today-value">
          <span className="hr-today-number">
            {todayData?.promedio_dia ? Math.round(todayData.promedio_dia) : '–'}
          </span>
          <span className="hr-today-label">HR prom</span>
        </div>
        {todayData && todayData.total_ventanas > 0 && (
          <p style={{ 
            fontSize: '12px', 
            color: '#263238', 
            marginTop: '8px',
            opacity: 0.7 
          }}>
            {todayData.ventanas_con_datos} de {todayData.total_ventanas} ventanas con datos
          </p>
        )}
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
              {todayData?.ventanas && todayData.ventanas.length > 0 ? (
                todayData.ventanas.map((x, i) => (
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
                    No hay ventanas registradas para hoy
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
