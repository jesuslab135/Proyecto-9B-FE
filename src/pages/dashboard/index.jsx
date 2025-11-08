import DashboardHR from "../../components/KPI/DashboardHR";
import DesiresPanel from "../../components/KPI/DesiresPanel";
import Header from "../../components/header_components/header";
import Sidebar from "../../components/sidebar_components/sidebar";
import useAuth from "../../hooks/useAuth";

/**
 * DashboardPage - Página principal con layout completo
 * 
 * Esta implementación incluye todo el layout (Sidebar + Header + Content)
 * Ideal para uso directo sin router anidado
 */
export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-soft-gray">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-vibrant-teal to-forest-green rounded-2xl shadow-xl p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      ¡Bienvenido de vuelta, {user?.nombre || 'Usuario'}!
                    </h2>
                    <p className="text-white/90 text-lg">
                      Aquí está tu resumen de hoy
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-24 w-24 text-white/30" 
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
            <div className="space-y-6">
              {/* Heart Rate Dashboard */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-blue/20 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-vibrant-teal/10 p-3 rounded-xl mr-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-vibrant-teal" 
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
                    <h3 className="text-xl font-bold text-dark-slate">Frecuencia Cardíaca</h3>
                    <p className="text-gray-600 text-sm">Monitoreo en tiempo real</p>
                  </div>
                </div>
                <DashboardHR />
              </div>

              {/* Desires Panel */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-blue/20 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-forest-green/10 p-3 rounded-xl mr-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-forest-green" 
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
                    <h3 className="text-xl font-bold text-dark-slate">Panel de Deseos</h3>
                    <p className="text-gray-600 text-sm">Análisis de tus preferencias</p>
                  </div>
                </div>
                <DesiresPanel />
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-gradient-to-br from-vibrant-teal to-sky-blue rounded-xl shadow-lg p-6 text-white hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold">Progreso</h4>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <p className="text-3xl font-bold">85%</p>
                <p className="text-white/80 text-sm mt-1">Objetivo mensual</p>
              </div>

              <div className="bg-gradient-to-br from-forest-green to-vibrant-teal rounded-xl shadow-lg p-6 text-white hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold">Racha</h4>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
                <p className="text-3xl font-bold">12 días</p>
                <p className="text-white/80 text-sm mt-1">Seguimiento activo</p>
              </div>

              <div className="bg-gradient-to-br from-sky-blue to-lime-green rounded-xl shadow-lg p-6 text-white hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold">Logros</h4>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold">8</p>
                <p className="text-white/80 text-sm mt-1">Insignias obtenidas</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}