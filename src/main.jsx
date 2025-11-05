import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/home/Home'
import Login_Register from './pages/login-register/Login_Register'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import PhysicalDataForm from './components/Onboarding/PhysicalDataForm'
import FormulariosForm from './components/Onboarding/FormulariosForm'

const App = lazy(() => import('./App'));

const router = createBrowserRouter([
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
        path: '/onboarding/physical-data',
        element: (
          <ProtectedRoute>
            <PhysicalDataForm />
          </ProtectedRoute>
        )
      },
      {
        path: '/onboarding/formularios',
        element: (
          <ProtectedRoute>
            <FormulariosForm />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute requiredRole="consumidor">
            <h1>Consumer Dashboard</h1>
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/dashboard',
        element: (
          <ProtectedRoute requiredRole="administrador">
            <h1>Admin Dashboard</h1>
          </ProtectedRoute>
        )
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
    <RouterProvider router={router} />
  </StrictMode>,
)
