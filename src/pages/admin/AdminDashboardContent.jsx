import React from 'react';
import DashboardHR from '../../components/KPI/DashboardHR';
import DashboardSensors from '../../components/KPI/DashboardSensors';
import DesiresPanel from '../../components/KPI/DesiresPanel';
import useAuth from '../../hooks/useAuth';

export default function AdminDashboardContent() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <p className="text-sm text-gray-600">Usuario: {user?.nombre} — Rol: {user?.rol}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Frecuencia Cardíaca (Resumen)</h2>
          <DashboardHR />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Sensores (EN VIVO)</h2>
          <DashboardSensors />
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Panel de Deseos (Insight)</h2>
        <DesiresPanel />
      </div>

      <div className="mt-6 bg-slate-50 rounded-2xl p-4 border">
        <h3 className="font-medium">Acciones administrativas</h3>
        <ul className="list-disc ml-5 mt-2 text-sm text-gray-700">
          <li>Ver y administrar usuarios (pendiente: implementar lista de usuarios)</li>
          <li>Generar reportes y descargar logs (ver `src/services/Logger.js`)</li>
          <li>Ver estado de ingestión de sensores y alertas</li>
        </ul>
      </div>
    </div>
  );
}
import React from 'react';
import DashboardHR from '../../components/KPI/DashboardHR';
import DashboardSensors from '../../components/KPI/DashboardSensors';
import DesiresPanel from '../../components/KPI/DesiresPanel';
import useAuth from '../../hooks/useAuth';

export default function AdminDashboardContent() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <p className="text-sm text-gray-600">Usuario: {user?.nombre} — Rol: {user?.rol}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Frecuencia Cardíaca (Resumen)</h2>
          <DashboardHR />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Sensores (EN VIVO)</h2>
          <DashboardSensors />
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Panel de Deseos (Insight)</h2>
        <DesiresPanel />
      </div>

      <div className="mt-6 bg-slate-50 rounded-2xl p-4 border">
        <h3 className="font-medium">Acciones administrativas</h3>
        <ul className="list-disc ml-5 mt-2 text-sm text-gray-700">
          <li>Ver y administrar usuarios (pendiente: implementar lista de usuarios)</li>
          <li>Generar reportes y descargar logs (ver `src/services/Logger.js`)</li>
          <li>Ver estado de ingestión de sensores y alertas</li>
        </ul>
      </div>
    </div>
  );
}
