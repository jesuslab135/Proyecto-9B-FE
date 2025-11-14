import { authService } from "../../services/AuthService";

export default function Header() {
    const user = authService.getCurrentUser();
    
    const userRole = user?.rol || 'guest';
    const userName = user?.nombre || 'Usuario';

    // Header configuration based on role
    const getHeaderConfig = () => {
        switch(userRole) {
            case 'consumidor':
                return {
                    title: 'Mi Dashboard',
                    subtitle: 'Monitorea tu progreso',
                    bgColor: 'bg-gradient-to-r from-vibrant-teal to-forest-green'
                };
            case 'administrador':
                return {
                    title: 'Panel de Administración',
                    subtitle: 'Gestiona el sistema',
                    bgColor: 'bg-gradient-to-r from-forest-green to-sky-blue'
                };
            default:
                return {
                    title: 'CravingPredict',
                    subtitle: 'Bienvenido',
                    bgColor: 'bg-gradient-to-r from-vibrant-teal to-forest-green'
                };
        }
    };

    const config = getHeaderConfig();

    return (
        <header style={{
            background: config.bgColor === 'bg-gradient-to-r from-vibrant-teal to-forest-green'
                ? 'linear-gradient(90deg, #00C4B4 0%, #2E7BD2 100%)'
                : 'linear-gradient(90deg, #2E7BD2 0%, #81D4FA 100%)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            <div style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '16px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    {/* Logo and Title Section */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(8px)',
                            padding: '8px',
                            borderRadius: '8px'
                        }}>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    color: 'white'
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
                            <h1 style={{
                                fontSize: '24px',
                                fontWeight: 700,
                                color: 'white',
                                marginBottom: '2px'
                            }}>
                                {config.title}
                            </h1>
                            <p style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '14px'
                            }}>
                                {config.subtitle}
                            </p>
                        </div>
                    </div>

                    {/* User Profile Section */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div style={{
                            textAlign: 'right'
                        }}>
                            <p style={{
                                color: 'white',
                                fontWeight: 600,
                                marginBottom: '2px',
                                fontSize: '16px'
                            }}>
                                {userName}
                            </p>
                            <p style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '14px',
                                textTransform: 'capitalize'
                            }}>
                                {userRole}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}