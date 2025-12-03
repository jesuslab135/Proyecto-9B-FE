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
import CRUD_usuarios from './pages/admin/usuarios/CRUD_usuarios'

// Admin CRUD Imports
import EmocionesList from './pages/admin/emociones/EmocionesList';
import EmocionForm from './pages/admin/emociones/EmocionForm';
import HabitosList from './pages/admin/habitos/HabitosList';
import HabitoForm from './pages/admin/habitos/HabitoForm';
import MotivosList from './pages/admin/motivos/MotivosList';
import MotivoForm from './pages/admin/motivos/MotivoForm';
import DeseosList from './pages/admin/deseos/DeseosList';
import DeseoForm from './pages/admin/deseos/DeseoForm';
import FormulariosList from './pages/admin/formularios/FormulariosList';
import FormularioForm from './pages/admin/formularios/FormularioForm';
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
      
      // Emociones
      { path: 'emociones', element: <EmocionesList /> },
      { path: 'emociones/create', element: <EmocionForm /> },
      { path: 'emociones/edit/:id', element: <EmocionForm /> },

      // Habitos
      { path: 'habitos', element: <HabitosList /> },
      { path: 'habitos/create', element: <HabitoForm /> },
      { path: 'habitos/edit/:id', element: <HabitoForm /> },

      // Motivos
      { path: 'motivos', element: <MotivosList /> },
      { path: 'motivos/create', element: <MotivoForm /> },
      { path: 'motivos/edit/:id', element: <MotivoForm /> },

      // Deseos
      { path: 'deseos', element: <DeseosList /> },
      { path: 'deseos/create', element: <DeseoForm /> },
      { path: 'deseos/edit/:id', element: <DeseoForm /> },

      // Formularios
      { path: 'formularios', element: <FormulariosList /> },
      { path: 'formularios/create', element: <FormularioForm /> },
      { path: 'formularios/edit/:id', element: <FormularioForm /> },

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
      },
      {
        path: '/hola',
        element: <h1>Hola Mundo</h1>
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
