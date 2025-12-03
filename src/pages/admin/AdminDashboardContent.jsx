import React from "react";
import DashboardHR from "../../components/KPI/DashboardHR";
import DashboardSensors from "../../components/KPI/DashboardSensors";
import DesiresPanel from "../../components/KPI/DesiresPanel";
import useAuth from "../../hooks/useAuth";
import "./AdminDashboard.css";
import { Link } from "react-router-dom";

export default function AdminDashboardContent() {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Opciones de Administración</h1>
        <p className="dashboard-subtitle">
          Usuario: {user?.nombre} — Rol: {user?.rol}
        </p>
      </div>

      <div class="dashboard-grid">
        <Link to={"/admin/usuarios"} class="dashboard-card">
          <div class="icon-circle" style={{ background: "var(--blue);" }}>
            <i class="fas fa-user"></i>
          </div>
          <div class="card-texts">
            <h3>Usuarios</h3>
            <p>Gestionar cuentas</p>
          </div>
        </Link>

        <Link to={"/admin/emociones"} class="dashboard-card">
          <div class="icon-circle" style={{ background: "var(--yellow);" }}>
            <i class="fas fa-smile"></i>
          </div>
          <div class="card-texts">
            <h3>Emociones</h3>
            <p>Administrar emociones</p>
          </div>
        </Link>

        <Link to={"/admin/habitos"} class="dashboard-card">
          <div class="icon-circle" style={{ background: "var(--green);" }}>
            <i class="fas fa-sliders-h"></i>
          </div>
          <div class="card-texts">
            <h3>Hábitos</h3>
            <p>Configurar hábitos</p>
          </div>
        </Link>

        <Link to={"/admin/motivos"} class="dashboard-card">
          <div class="icon-circle" style={{ background: "var(--purple);" }}>
            <i class="fas fa-lightbulb"></i>
          </div>
          <div class="card-texts">
            <h3>Motivos</h3>
            <p>Gestionar motivos</p>
          </div>
        </Link>

        <Link to={"/admin/deseos"} class="dashboard-card">
          <div class="icon-circle" style={{ background: "var(--red);" }}>
            <i class="fas fa-fire"></i>
          </div>
          <div class="card-texts">
            <h3>Deseos</h3>
            <p>Administrar deseos</p>
          </div>
        </Link>

        <Link to={"/admin/formularios"} class="dashboard-card">
          <div class="icon-circle" style={{ background: "var(--pink);" }}>
            <i class="fas fa-file-alt"></i>
          </div>
          <div class="card-texts">
            <h3>Formularios</h3>
            <p>Gestionar formularios</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
