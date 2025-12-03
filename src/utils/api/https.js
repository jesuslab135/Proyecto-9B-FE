import axios from "axios";

// ============================================================
// ✅ CONFIGURACIÓN DE URLs BASE
// ============================================================

// Detectar entorno
const isDevelopment = import.meta.env.MODE === 'development';

// ✅ HTTP Base URL (Railway en producción, localhost en desarrollo)
const envBase = import.meta?.env?.VITE_API_BASE_URL || 
  (isDevelopment 
    ? "http://127.0.0.1:8000/api/" 
    : "https://backend9b-production.up.railway.app/api/"); // added

// ✅ WebSocket Base URL (wss:// en Railway, ws:// en local)
// Estrategia: Reemplazar /api (con o sin /) por /ws/ y asegurar una sola barra final
const wsBase = envBase
  .replace('http://', 'ws://')
  .replace('https://', 'wss://');

// Remover /api o /api/ y agregar /ws/
export const WS_BASE_URL = wsBase.replace(/\/api\/?/, '/ws/');

console.log('🌐 API Base URL:', envBase);
console.log('🔌 WebSocket URL:', WS_BASE_URL);

// ============================================================
// AXIOS INSTANCE
// ============================================================
export const http = axios.create({
  baseURL: envBase,
  timeout: 30000, // ⚠️ Aumentado a 30s para Railway (puede ser más lento que local)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================
// REQUEST INTERCEPTOR: Agregar token a todas las peticiones
// ============================================================
http.interceptors.request.use(
  (cfg) => {
    const token = localStorage.getItem("auth_token");
    
    if (token) {
      console.log('🔑 Sending token:', token.substring(0, 20) + '...');
      cfg.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No auth token found in localStorage');
    }
    return cfg;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ============================================================
// RESPONSE INTERCEPTOR: Manejo de errores + Token Refresh
// ============================================================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

http.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.config.url, response.status);
    return response;
  },
  
  async (error) => {
    const originalRequest = error.config;

    // Log del error para debugging
    console.error('❌ Response error:', {
      url: originalRequest?.url,
      status: error.response?.status,
      message: error.message,
    });

    // Si es 401 (token expirado) y no hemos reintentado
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return http(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          console.warn('⚠️ No refresh token available, redirecting to login');
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        console.log('🔄 Refreshing access token...');
        
        // ✅ Usar la misma base URL (Railway o local)
        const refreshUrl = `${envBase.replace('/api/', '')}/api/token/refresh/`;
        
        const response = await axios.post(refreshUrl, { 
          refresh: refreshToken 
        });

        const { access } = response.data;
        
        if (!access) {
          throw new Error('No access token in refresh response');
        }
        
        localStorage.setItem('auth_token', access);
        
        if (response.data.expires_in) {
          const expiryTime = Date.now() + (response.data.expires_in * 1000);
          localStorage.setItem('token_expiry', expiryTime.toString());
        }
        
        originalRequest.headers['Authorization'] = 'Bearer ' + access;
        processQueue(null, access);
        
        console.log('✅ Token refreshed successfully');
        
        return http(originalRequest);
        
      } catch (refreshError) {
        console.error('❌ Failed to refresh token:', refreshError);
        processQueue(refreshError, null);
        
        localStorage.clear();
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Manejo de errores específicos de Railway
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Timeout: El servidor tardó demasiado en responder'));
    }

    if (!error.response) {
      return Promise.reject(new Error('Error de red: No se pudo conectar con el servidor'));
    }

    const msg =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      "Error de red";
    
    return Promise.reject(new Error(msg));
  }
);

export default http;