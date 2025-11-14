import { Outlet } from "react-router-dom";
import Header from "../header_components/header";
import Sidebar from "../sidebar_components/sidebar";

/**
 * DashboardLayout - Layout principal para páginas del dashboard
 * 
 * Este componente proporciona la estructura común:
 * - Sidebar a la izquierda (dinámico por rol)
 * - Header en la parte superior (dinámico por rol)
 * - Área de contenido donde se renderiza el contenido de cada página
 * 
 * Uso en el Router:
 * <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
 *   <Route path="dashboard" element={<DashboardContent />} />
 *   <Route path="profile" element={<ProfilePage />} />
 * </Route>
 */
export default function DashboardLayout() {
    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            background: '#F5F7FA'
        }}>
            {/* Sidebar - Se muestra en todas las páginas del dashboard */}
            <Sidebar />
            
            {/* Main Content Area */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0
            }}>
                {/* Header - Se muestra en todas las páginas del dashboard */}
                <Header />
                
                {/* 
                  Outlet - Aquí se renderizan las páginas hijas 
                  Ejemplo: DashboardContent, ProfilePage, etc.
                */}
                <main style={{
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
