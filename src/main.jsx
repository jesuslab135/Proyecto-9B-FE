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

const App = lazy(() => import('./App'));

const queryClient = new QueryClient()

const router = createBrowserRouter([
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

  /* Dashboard para Admin (si lo necesitas separado) */
  {
    element: (
      <ProtectedRoute requiredRole="administrador">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/admin/dashboard',
        element: <AdminDashboardContent />,
      },
      {
        path: '/admin/usuarios',
        element: <CRUD_usuarios />
      }
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
