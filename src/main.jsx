import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/home/Home'

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
