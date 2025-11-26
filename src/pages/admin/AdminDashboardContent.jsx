import React from 'react';
import DashboardHR from '../../components/KPI/DashboardHR';
import DashboardSensors from '../../components/KPI/DashboardSensors';
import DesiresPanel from '../../components/KPI/DesiresPanel';
import useAuth from '../../hooks/useAuth';
import "./AdminDashboard.css";

export default function AdminDashboardContent() {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Panel de Administración</h1>
        <p className="dashboard-subtitle">
          Usuario: {user?.nombre} — Rol: {user?.rol}
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2 className="card-title">Frecuencia Cardíaca (Resumen)</h2>
          <DashboardHR />
        </div>

        <div className="dashboard-card">
          <h2 className="card-title">Sensores (EN VIVO)</h2>
          <DashboardSensors />
        </div>
      </div>

      <div className="dashboard-card mt-6">
        <h2 className="card-title">Panel de Deseos (Insight)</h2>
        <DesiresPanel />
      </div>

      {/* <div className="admin-actions">
        <h3 className="actions-title">Acciones administrativas</h3>
        <ul className="actions-list">
          <li>Ver y administrar usuarios (pendiente: implementar lista de usuarios)</li>
          <li>Generar reportes y descargar logs (ver `src/services/Logger.js`)</li>
          <li>Ver estado de ingestión de sensores y alertas</li>
        </ul>
      </div> */}
    </div>
  );
}
