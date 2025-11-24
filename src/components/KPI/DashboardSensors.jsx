import { useEffect, useState } from "react";
import { useSensorData } from "../../hooks/useDashboard";
import { authService } from "../../services/AuthService";
import "./DashboardSensors.css";

export default function DashboardSensors() {
  const user = authService.getCurrentUser();
  const consumidorId = user?.consumidor_id || 1;
  
  // Fetch sensor data with auto-refresh
  const { data: sensorData, isLoading, error, refetch } = useSensorData(consumidorId);
  
  // Auto-refresh every 5 seconds to match ESP32 send interval
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="sensor-loading">
        <div className="loading-spinner"></div>
        <p>⏳ Cargando datos de sensores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sensor-error">
        <p>❌ Error al cargar datos: {error.message}</p>
      </div>
    );
  }

  // Get the latest reading
  const latestReading = sensorData && sensorData.length > 0 ? sensorData[0] : null;
  
  // Calculate accelerometer magnitude (movement intensity)
  const accelMagnitude = latestReading 
    ? Math.sqrt(
        Math.pow(latestReading.accel_x || 0, 2) + 
        Math.pow(latestReading.accel_y || 0, 2) + 
        Math.pow(latestReading.accel_z || 0, 2)
      ).toFixed(3)
    : '0.000';
  
  // Calculate gyroscope magnitude (rotation intensity)
  const gyroMagnitude = latestReading
    ? Math.sqrt(
        Math.pow(latestReading.gyro_x || 0, 2) + 
        Math.pow(latestReading.gyro_y || 0, 2) + 
        Math.pow(latestReading.gyro_z || 0, 2)
      ).toFixed(2)
    : '0.00';

  return (
    <div className="dashboard-sensors-container">
      {/* Real-time Indicator */}
      <div className="sensor-header">
        <h4>Datos de Sensores ESP32</h4>
        <div className="live-indicator">
          <div className="pulse-dot"></div>
          <span>EN VIVO</span>
        </div>
      </div>

      {/* Latest Reading Timestamp */}
      {latestReading && (
        <div className="sensor-timestamp">
          <span>Última actualización: </span>
          <strong>
            {new Date(latestReading.created_at).toLocaleString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </strong>
        </div>
      )}

      {/* Accelerometer Section */}
      <div className="sensor-section accelerometer">
        <div className="sensor-section-header">
          <div className="sensor-icon accel-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h5>Acelerómetro (g)</h5>
            <p className="magnitude-value">Magnitud: {accelMagnitude} g</p>
          </div>
        </div>
        
        <div className="sensor-readings">
          <div className="sensor-axis">
            <div className="axis-label">X</div>
            <div className="axis-bar-container">
              <div 
                className="axis-bar accel-x"
                style={{
                  width: `${Math.min(Math.abs((latestReading?.accel_x || 0) * 50), 100)}%`,
                  marginLeft: (latestReading?.accel_x || 0) < 0 ? '50%' : '50%',
                  transform: (latestReading?.accel_x || 0) < 0 ? 'translateX(-100%)' : 'none'
                }}
              />
              <div className="axis-zero-line"></div>
            </div>
            <div className="axis-value">
              {latestReading?.accel_x?.toFixed(3) || '0.000'}
            </div>
          </div>
          
          <div className="sensor-axis">
            <div className="axis-label">Y</div>
            <div className="axis-bar-container">
              <div 
                className="axis-bar accel-y"
                style={{
                  width: `${Math.min(Math.abs((latestReading?.accel_y || 0) * 50), 100)}%`,
                  marginLeft: (latestReading?.accel_y || 0) < 0 ? '50%' : '50%',
                  transform: (latestReading?.accel_y || 0) < 0 ? 'translateX(-100%)' : 'none'
                }}
              />
              <div className="axis-zero-line"></div>
            </div>
            <div className="axis-value">
              {latestReading?.accel_y?.toFixed(3) || '0.000'}
            </div>
          </div>
          
          <div className="sensor-axis">
            <div className="axis-label">Z</div>
            <div className="axis-bar-container">
              <div 
                className="axis-bar accel-z"
                style={{
                  width: `${Math.min(Math.abs((latestReading?.accel_z || 0) * 50), 100)}%`,
                  marginLeft: (latestReading?.accel_z || 0) < 0 ? '50%' : '50%',
                  transform: (latestReading?.accel_z || 0) < 0 ? 'translateX(-100%)' : 'none'
                }}
              />
              <div className="axis-zero-line"></div>
            </div>
            <div className="axis-value">
              {latestReading?.accel_z?.toFixed(3) || '0.000'}
            </div>
          </div>
        </div>
      </div>

      {/* Gyroscope Section */}
      <div className="sensor-section gyroscope">
        <div className="sensor-section-header">
          <div className="sensor-icon gyro-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div>
            <h5>Giroscopio (°/s)</h5>
            <p className="magnitude-value">Magnitud: {gyroMagnitude} °/s</p>
          </div>
        </div>
        
        <div className="sensor-readings">
          <div className="sensor-axis">
            <div className="axis-label">X</div>
            <div className="axis-bar-container">
              <div 
                className="axis-bar gyro-x"
                style={{
                  width: `${Math.min(Math.abs((latestReading?.gyro_x || 0) / 2), 100)}%`,
                  marginLeft: (latestReading?.gyro_x || 0) < 0 ? '50%' : '50%',
                  transform: (latestReading?.gyro_x || 0) < 0 ? 'translateX(-100%)' : 'none'
                }}
              />
              <div className="axis-zero-line"></div>
            </div>
            <div className="axis-value">
              {latestReading?.gyro_x?.toFixed(2) || '0.00'}
            </div>
          </div>
          
          <div className="sensor-axis">
            <div className="axis-label">Y</div>
            <div className="axis-bar-container">
              <div 
                className="axis-bar gyro-y"
                style={{
                  width: `${Math.min(Math.abs((latestReading?.gyro_y || 0) / 2), 100)}%`,
                  marginLeft: (latestReading?.gyro_y || 0) < 0 ? '50%' : '50%',
                  transform: (latestReading?.gyro_y || 0) < 0 ? 'translateX(-100%)' : 'none'
                }}
              />
              <div className="axis-zero-line"></div>
            </div>
            <div className="axis-value">
              {latestReading?.gyro_y?.toFixed(2) || '0.00'}
            </div>
          </div>
          
          <div className="sensor-axis">
            <div className="axis-label">Z</div>
            <div className="axis-bar-container">
              <div 
                className="axis-bar gyro-z"
                style={{
                  width: `${Math.min(Math.abs((latestReading?.gyro_z || 0) / 2), 100)}%`,
                  marginLeft: (latestReading?.gyro_z || 0) < 0 ? '50%' : '50%',
                  transform: (latestReading?.gyro_z || 0) < 0 ? 'translateX(-100%)' : 'none'
                }}
              />
              <div className="axis-zero-line"></div>
            </div>
            <div className="axis-value">
              {latestReading?.gyro_z?.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Readings Table */}
      <div className="sensor-history">
        <h5>Historial Reciente</h5>
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Accel (g)</th>
                <th>Gyro (°/s)</th>
              </tr>
            </thead>
            <tbody>
              {sensorData && sensorData.slice(0, 5).map((reading, index) => (
                <tr key={index} className={index === 0 ? 'latest-row' : ''}>
                  <td>
                    {new Date(reading.created_at).toLocaleTimeString('es-ES')}
                  </td>
                  <td>
                    {Math.sqrt(
                      Math.pow(reading.accel_x || 0, 2) + 
                      Math.pow(reading.accel_y || 0, 2) + 
                      Math.pow(reading.accel_z || 0, 2)
                    ).toFixed(3)}
                  </td>
                  <td>
                    {Math.sqrt(
                      Math.pow(reading.gyro_x || 0, 2) + 
                      Math.pow(reading.gyro_y || 0, 2) + 
                      Math.pow(reading.gyro_z || 0, 2)
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!latestReading && (
        <div className="no-data-message">
          <p>📡 Esperando datos del ESP32...</p>
          <p className="hint">Asegúrate de que el dispositivo esté conectado y enviando datos</p>
        </div>
      )}
    </div>
  );
}
