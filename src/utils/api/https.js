import axios from "axios";

// ✅ HTTP Base URL
const envBase =
  import.meta?.env?.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api/";

// ✅ WebSocket Base URL (derivada de HTTP Base URL)
export const WS_BASE_URL = envBase
  .replace('http://', 'ws://')
  .replace('https://', 'wss://')
  .replace('/api/', '/ws/');  // WS usa /ws/ en lugar de /api/

export const http = axios.create({
  baseURL: envBase,
  timeout: 10000,
});

// ============================================================
// REQUEST INTERCEPTOR: Agregar token a todas las peticiones
// ============================================================
http.interceptors.request.use(
  (cfg) => {
    // ✅ Usar 'auth_token' (definido en StorageService.KEYS.TOKEN)
    const token = localStorage.getItem("auth_token");
    
    if (token) {
      // Debug: Log para verificar que el token se está enviando
      console.log('🔑 Sending token:', token.substring(0, 20) + '...');
      cfg.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No auth token found in localStorage');
    }
    return cfg;
  },
  (error) => {
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
  // ✅ SUCCESS: Retornar respuesta tal cual
  (response) => response,
  
  // ❌ ERROR: Manejo de errores + refresh automático
  async (error) => {
    const originalRequest = error.config;

    // Si es 401 (token expirado) y no hemos reintentado
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Si ya estamos refrescando, agregar a la cola
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
        // ✅ Usar 'refresh_token' (definido en StorageService.KEYS.REFRESH_TOKEN)
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          console.warn('⚠️ No refresh token available, redirecting to login');
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        console.log('🔄 Refreshing access token...');
        
        // ✅ Llamar endpoint de refresh con axios directo
        const response = await axios.post(
          'http://127.0.0.1:8000/api/token/refresh/',
          { refresh: refreshToken }
        );

        const { access } = response.data;
        
        if (!access) {
          throw new Error('No access token in refresh response');
        }
        
        // ✅ Guardar nuevo token como 'auth_token' (StorageService.KEYS.TOKEN)
        localStorage.setItem('auth_token', access);
        
        // ✅ También actualizar expiry si existe
        // (Opcional: el backend puede devolver expires_in)
        if (response.data.expires_in) {
          const expiryTime = Date.now() + (response.data.expires_in * 1000);
          localStorage.setItem('token_expiry', expiryTime.toString());
        }
        
        // Actualizar header de la petición original
        originalRequest.headers['Authorization'] = 'Bearer ' + access;
        
        // Procesar cola de peticiones fallidas
        processQueue(null, access);
        
        console.log('✅ Token refreshed successfully');
        
        // Reintentar petición original con nuevo token
        return http(originalRequest);
        
      } catch (refreshError) {
        console.error('❌ Failed to refresh token:', refreshError);
        processQueue(refreshError, null);
        
        // Token refresh falló, hacer logout limpio
        localStorage.clear();
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Para otros errores (no 401), extraer mensaje amigable
    const msg =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      "Error de red";
    
    return Promise.reject(new Error(msg));
  }
);