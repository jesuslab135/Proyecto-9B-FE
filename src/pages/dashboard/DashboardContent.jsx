import DashboardHR from "../../components/KPI/DashboardHR";
import DesiresPanel from "../../components/KPI/DesiresPanel";
import { authService } from "../../services/AuthService";

/**
 * DashboardContent - Contenido principal del dashboard
 * 
 * Esta es solo el contenido de la página.
 * El Sidebar y Header se renderizan por DashboardLayout
 */
export default function DashboardContent() {
  const user = authService.getCurrentUser();

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '32px 24px',
      background: '#F5F7FA'
    }}>
      {/* Welcome Section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #00C4B4 0%, #2E7BD2 100%)',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0, 196, 180, 0.2)',
          padding: '32px',
          color: 'white'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 700,
                marginBottom: '8px',
                margin: 0
              }}>
                ¡Bienvenido de vuelta, {user?.nombre || 'Usuario'}!
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
      </div>

      {/* Dashboard Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                Panel de Deseos
              </h3>
              <p style={{
                color: '#666',
                fontSize: '14px',
                margin: 0
              }}>
                Análisis de tus preferencias
              </p>
            </div>
          </div>
          <DesiresPanel />
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginTop: '24px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #00C4B4 0%, #81D4FA 100%)',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 196, 180, 0.2)',
          padding: '24px',
          color: 'white',
          transition: 'transform 0.3s',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Progreso</h4>
            <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '32px', height: '32px', opacity: 0.5 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p style={{ fontSize: '32px', fontWeight: 700, margin: '8px 0' }}>85%</p>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: 0 }}>Objetivo mensual</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #2E7BD2 0%, #00C4B4 100%)',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(46, 123, 210, 0.2)',
          padding: '24px',
          color: 'white',
          transition: 'transform 0.3s',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Racha</h4>
            <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '32px', height: '32px', opacity: 0.5 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
          </div>
          <p style={{ fontSize: '32px', fontWeight: 700, margin: '8px 0' }}>12 días</p>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: 0 }}>Seguimiento activo</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #81D4FA 0%, #A7FFEB 100%)',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(129, 212, 250, 0.2)',
          padding: '24px',
          color: 'white',
          transition: 'transform 0.3s',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Logros</h4>
            <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '32px', height: '32px', opacity: 0.5 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <p style={{ fontSize: '32px', fontWeight: 700, margin: '8px 0' }}>8</p>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: 0 }}>Insignias obtenidas</p>
        </div>
      </div>
    </div>
  );
}
