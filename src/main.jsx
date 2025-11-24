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
import EmocionesList from './pages/admin/emociones/EmocionesList'
import EmocionForm from './pages/admin/emociones/EmocionForm'
import HabitosList from './pages/admin/habitos/HabitosList'
import HabitoForm from './pages/admin/habitos/HabitoForm'
import MotivosList from './pages/admin/motivos/MotivosList'
import MotivoForm from './pages/admin/motivos/MotivoForm'
import FormulariosList from './pages/admin/formularios/FormulariosList'
import FormularioForm from './pages/admin/formularios/FormularioForm'
import DeseosList from './pages/admin/deseos/DeseosList'
import DeseoForm from './pages/admin/deseos/DeseoForm'
import UsuariosList from './pages/admin/usuarios/UsuariosList'
import UsuarioForm from './pages/admin/usuarios/UsuarioForm'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
        element: <AdminDashboardContent />
      },
      { path: 'emociones', element: <EmocionesList /> },
      { path: 'emociones/create', element: <EmocionForm /> },
      { path: 'emociones/edit/:id', element: <EmocionForm /> },

      { path: 'habitos', element: <HabitosList /> },
      { path: 'habitos/create', element: <HabitoForm /> },
      { path: 'habitos/edit/:id', element: <HabitoForm /> },

      { path: 'motivos', element: <MotivosList /> },
      { path: 'motivos/create', element: <MotivoForm /> },
      { path: 'motivos/edit/:id', element: <MotivoForm /> },

      { path: 'formularios', element: <FormulariosList /> },
      { path: 'formularios/create', element: <FormularioForm /> },
      { path: 'formularios/edit/:id', element: <FormularioForm /> },

      { path: 'deseos', element: <DeseosList /> },
      { path: 'deseos/create', element: <DeseoForm /> },
      { path: 'deseos/edit/:id', element: <DeseoForm /> },
      
      { path: 'usuarios', element: <UsuariosList /> },
      { path: 'usuarios/nuevo', element: <UsuarioForm /> },
      { path: 'usuarios/editar/:id', element: <UsuarioForm /> },
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
        path: '/login',
        element: <Login_Register />
      },
      {
        path: '/hola',
        element: <h1>Hola Mundo</h1>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
