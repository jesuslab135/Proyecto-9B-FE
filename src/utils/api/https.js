import axios from "axios";

const envBase =
  import.meta?.env?.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api/";

export const http = axios.create({
  baseURL: envBase,
  timeout: 10000,
});

http.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err?.response?.data?.detail ||
      err?.response?.data?.message ||
      err?.message || "Error de red";
    return Promise.reject(new Error(msg));
  }
);
