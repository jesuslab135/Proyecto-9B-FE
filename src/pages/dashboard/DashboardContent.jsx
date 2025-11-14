import DashboardHR from "../../components/KPI/DashboardHR";
import DashboardSensors from "../../components/KPI/DashboardSensors";
import DashboardPanel from "../../components/KPI/DesiresPanel";
import { authService } from "../../services/AuthService";

export default function DashboardContent() {
  const user = authService.getCurrentUser();
  const userName = user?.nombre || "Usuario";

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F5F7FA 0%, #E8EEF2 100%)',
      padding: '24px'
    }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #00C4B4 0%, #2E7BD2 100%)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(0, 196, 180, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h2 style={{
              color: '#fff',
              fontSize: '32px',
              fontWeight: 700,
              margin: 0,
              marginBottom: '8px',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
              Bienvenido, {userName}! 👋
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '16px',
              margin: 0
            }}>
              Aquí está tu resumen de hoy
            </p>
          </div>
          <div style={{ display: window.innerWidth < 768 ? 'none' : 'block' }}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              style={{
                width: '96px',
                height: '96px',
                color: 'rgba(255, 255, 255, 0.3)'
              }}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Real-time Sensor Data Panel - NEW! */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          padding: '24px',
          border: '1px solid #E8F0FE',
          transition: 'box-shadow 0.3s'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(239, 83, 80, 0.1) 0%, rgba(255, 112, 67, 0.1) 100%)',
              padding: '12px',
              borderRadius: '12px',
              marginRight: '16px'
            }}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                style={{
                  width: '24px',
                  height: '24px',
                  color: '#EF5350'
                }}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" 
                />
              </svg>
            </div>
            <div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#263238',
                margin: 0,
                marginBottom: '4px'
              }}>
                Sensores ESP32 en Tiempo Real
              </h3>
              <p style={{
                color: '#666',
                fontSize: '14px',
                margin: 0
              }}>
                Acelerómetro y Giroscopio
              </p>
            </div>
          </div>
          <DashboardSensors />
        </div>

        {/* Heart Rate Dashboard */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          padding: '24px',
          border: '1px solid #E8F0FE',
          transition: 'box-shadow 0.3s'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 196, 180, 0.1) 0%, rgba(46, 123, 210, 0.1) 100%)',
              padding: '12px',
              borderRadius: '12px',
              marginRight: '16px'
            }}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                style={{
                  width: '24px',
                  height: '24px',
                  color: '#00C4B4'
                }}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
            </div>
            <div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#263238',
                margin: 0,
                marginBottom: '4px'
              }}>
                Frecuencia Cardíaca
              </h3>
              <p style={{
                color: '#666',
                fontSize: '14px',
                margin: 0
              }}>
                Monitoreo en tiempo real
              </p>
            </div>
          </div>
          <DashboardHR />
        </div>

        {/* Desires Panel */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          padding: '24px',
          border: '1px solid #E8F0FE',
          transition: 'box-shadow 0.3s'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(46, 123, 210, 0.1) 0%, rgba(0, 196, 180, 0.1) 100%)',
              padding: '12px',
              borderRadius: '12px',
              marginRight: '16px'
            }}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                style={{
                  width: '24px',
                  height: '24px',
                  color: '#2E7BD2'
                }}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                />
              </svg>
            </div>
            <div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#263238',
                margin: 0,
                marginBottom: '4px'
              }}>
                Tracking de Deseos
              </h3>
              <p style={{
                color: '#666',
                fontSize: '14px',
                margin: 0
              }}>
                Seguimiento de impulsos
              </p>
            </div>
          </div>
          <DashboardPanel />
        </div>
      </div>
    </div>
  );
}
