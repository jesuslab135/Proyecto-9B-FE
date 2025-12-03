import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/home/Home'
import Login_Register from './pages/login-register/Login_Register'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import PhysicalDataForm from './components/Onboarding/PhysicalDataForm'
import Habits from './pages/onboarding/Habits'
import Results from './pages/onboarding/Results'
import DashboardLayout from './components/layouts/DashboardLayout'
import DashboardContent from './pages/dashboard/DashboardContent'
import AdminDashboardContent from './pages/admin/AdminDashboardContent'
import MiProgresoPage from './pages/progress/MiProgreso';
import ConfiguracionPage from './pages/settings/Configuracion';


import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Admin Pages - Usuarios
import CRUD_usuarios from './pages/admin/usuarios/CRUD_usuarios'
import Create_usuario from './pages/admin/usuarios/Create_usuario'
import Update_usuario from './pages/admin/usuarios/Update_usuario'

// Admin Pages - Habitos
import CRUD_habitos from './pages/admin/habitos/CRUD_habitos'
import Create_habito from './pages/admin/habitos/Create_habito'
import Edit_habito from './pages/admin/habitos/Edit_habito'

// Admin Pages - Deseos
import CRUD_deseos from './pages/admin/deseos/CRUD_deseos'
import Create_deseo from './pages/admin/deseos/Create_deseo'
import Edit_deseo from './pages/admin/deseos/Edit_deseo'

// Admin Pages - Emociones
import CRUD_emociones from './pages/admin/emociones/CRUD_emociones'
import Create_emocion from './pages/admin/emociones/Create_emocion'
import Edit_emocion from './pages/admin/emociones/Edit_emocion'

// Admin Pages - Motivos
import CRUD_motivos from './pages/admin/motivos/CRUD_motivos'
import Create_motivo from './pages/admin/motivos/Create_motivo'
import Edit_motivo from './pages/admin/motivos/Edit_motivo'

// Admin Pages - Formularios
import CRUD_formularios from './pages/admin/formularios/CRUD_formularios'
import Create_formulario from './pages/admin/formularios/Create_formulario'
import Edit_formulario from './pages/admin/formularios/Edit_formulario'

// Admin Pages - Otros
import Reportes_page from './pages/admin/reportes/Reportes_page'
import Settings_adm_page from './pages/admin/Settings/Settings_adm_page'

const App = lazy(() => import('./App'));

const queryClient = new QueryClient()

const router = createBrowserRouter([
  /* Dashboard para Admin */
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="administrador">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <AdminDashboardContent />,
      },
      {
        path: 'usuarios',
        element: <CRUD_usuarios />
      },
      {
        path: 'usuarios/create',
        element: <Create_usuario />
      },
      {
        path: 'usuarios/update/:id',
        element: <Update_usuario />
      },
      
      // Habitos
      { path: 'habitos', element: <CRUD_habitos /> },
      { path: 'habitos/create', element: <Create_habito /> },
      { path: 'habitos/edit/:id', element: <Edit_habito /> },

      // Deseos
      { path: 'deseos', element: <CRUD_deseos /> },
      { path: 'deseos/create', element: <Create_deseo /> },
      { path: 'deseos/edit/:id', element: <Edit_deseo /> },

      // Emociones
      { path: 'emociones', element: <CRUD_emociones /> },
      { path: 'emociones/create', element: <Create_emocion /> },
      { path: 'emociones/edit/:id', element: <Edit_emocion /> },

      // Motivos
      { path: 'motivos', element: <CRUD_motivos /> },
      { path: 'motivos/create', element: <Create_motivo /> },
      { path: 'motivos/edit/:id', element: <Edit_motivo /> },

      // Formularios
      { path: 'formularios', element: <CRUD_formularios /> },
      { path: 'formularios/create', element: <Create_formulario /> },
      { path: 'formularios/edit/:id', element: <Edit_formulario /> },

      {
        path: 'reportes',
        element: <Reportes_page />
      },
      {
        path: 'configuracion',
        element: <Settings_adm_page />
      }
    ]
  },

  {
    path: '/login',
    element: <Login_Register />
  },
  {
    path: '/onboarding/physical-data',
    element: (
      <ProtectedRoute>
        <PhysicalDataForm />
      </ProtectedRoute>
    )
  },
  {
    path: '/onboarding/habitos',
    element: (
      <ProtectedRoute>
        <Habits />
      </ProtectedRoute>
    )
  },
  {
    path: '/onboarding/resultados',
    element: (
      <ProtectedRoute>
        <Results />
      </ProtectedRoute>
    )
  },
  
  /* 
    Dashboard Layout - Envuelve todas las rutas del dashboard
    Proporciona Sidebar + Header automáticamente
  */
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardContent />
      },
      {
        path: '/progress',
        element: <MiProgresoPage />
      },
      {
        path: '/configuration',  
        element: <ConfiguracionPage />
      }
      // Agrega más rutas aquí que necesiten el mismo layout
      // {
      //   path: '/profile',
      //   element: <ProfilePage />
      // },
      // {
      //   path: '/settings',
      //   element: <SettingsPage />
      // }
    ]
  },

  /* Rutas públicas con NavBar y Footer */
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      }
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
