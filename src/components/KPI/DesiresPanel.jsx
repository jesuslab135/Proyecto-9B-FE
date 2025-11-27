import { useState, useEffect } from "react";
import { authService } from "../../services/AuthService";
import { useDesiresStats, useDesiresTracking } from "../../hooks/useDashboard";
import "./DesiresPanel.css";

export default function DesiresPanel() {
  // Obtener el usuario autenticado
  const user = authService.getCurrentUser();
  const consumidorId = user?.consumidor_id || 1;
  
  const [desiresData, setDesiresData] = useState(null);
  
  // ✅ USAR API REST - WebSocket no es necesario para desires (eventos poco frecuentes)
  // Según guía: "DesiresPanel - Mantener API REST (Recomendado)"
  const { data: statsData } = useDesiresStats(consumidorId);
  const { data: trackingData } = useDesiresTracking(consumidorId);
  
  // Actualizar desiresData cuando lleguen datos de la API REST
  useEffect(() => {
    if (statsData && trackingData) {
      setDesiresData({
        stats: statsData,
        tracking: trackingData
      });
    }
  }, [statsData, trackingData]);

  if (!desiresData) {
    return (
      <div className="desires-loading">
        <p>⏳ Cargando datos de deseos...</p>
      </div>
    );
  }

  const stats = desiresData.stats || [];
  const track = desiresData.tracking || [];

  return (
    <div className="desires-panel-container">
      {/* Stats Cards */}
      <div className="desires-stats-grid">
        {stats && stats.length > 0 ? (
          stats.map((s) => (
            <div key={s.deseo_tipo} className="desire-stat-card">
              <div className="desire-stat-header">
                <div className="desire-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="desire-type-name">{s.deseo_tipo}</div>
              </div>
              <div className="desire-stat-numbers">
                <div className="desire-total">
                  <span className="desire-total-label">Total</span>
                  <span className="desire-total-value">{s.total_deseos || 0}</span>
                </div>
                <div className="desire-resolution">
                  <span className="desire-resolution-label">Resolución</span>
                  <span className="desire-resolution-value">
                    {s.porcentaje_resolucion || 0}%
                  </span>
                  <span className="desire-resolved-count">
                    {s.deseos_resueltos || 0} resueltos
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="desires-empty">
            <p>No hay estadísticas disponibles</p>
          </div>
        )}
      </div>

      {/* Timeline Section */}
      <div className="desires-timeline-section">
        <div className="desires-timeline-header">
          <div className="timeline-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4>Timeline</h4>
        </div>

        <div className="desires-table-wrapper">
          <div className="desires-table-scroll">
            <table className="desires-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Resuelto</th>
                  <th>HR durante</th>
                  <th>Prob(urge)</th>
                </tr>
              </thead>
              <tbody>
                {track && track.length > 0 ? (
                  track.map((d) => (
                    <tr key={d.deseo_id}>
                      <td>{new Date(d.fecha_creacion).toLocaleString('es-ES')}</td>
                      <td>
                        <span className="desire-type-badge">{d.deseo_tipo}</span>
                      </td>
                      <td>
                        <span className={`desire-status-badge ${d.resolved ? 'desire-status-resolved' : 'desire-status-pending'}`}>
                          {d.resolved ? "✓ Sí" : "⏱ No"}
                        </span>
                      </td>
                      <td className="desire-hr-value">
                        {d.heart_rate_durante ? Math.round(d.heart_rate_durante) : "–"}
                      </td>
                      <td className="desire-prob-value">
                        {d.probabilidad_modelo ? `${(d.probabilidad_modelo * 100).toFixed(1)}%` : "–"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
                      <div className="desires-empty">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p>No hay registros de deseos</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
