import { http } from "./https";
import { API } from "./endpoints";

// Helper para extraer results de respuestas paginadas del backend
const get = (path, params) => http.get(`/${path}/`, { params }).then(r => {
  // Si la respuesta tiene 'results' (paginada), retornar solo el array
  if (r.data && typeof r.data === 'object' && 'results' in r.data) {
    return r.data.results;
  }
  // Si no, retornar data completa
  return r.data;
});

export const DashboardAPI = {
  habitTracking:     (p) => get(API.dashboard.habitTracking, p),
  habitStats:        (p) => get(API.dashboard.habitStats, p),

  // Ventanas (HR) timeline y KPIs
  heartRate:         (p) => get(API.dashboard.heartRate, p),
  heartRateStats:    (p) => get(API.dashboard.heartRateStats, p),

  // Analisis timeline + resumen
  predictionTimeline:(p) => get(API.dashboard.predictionTimeline, p),
  predictionSummary: (p) => get(API.dashboard.predictionSummary, p),

  // Deseos timeline + KPIs
  desiresTracking:   (p) => get(API.dashboard.desiresTracking, p),
  desiresStats:      (p) => get(API.dashboard.desiresStats, p),

  // Resumen diario + comparación semanal
  dailySummary:      (p) => get(API.dashboard.dailySummary, p),
  weeklyComparison:  (p) => get(API.dashboard.weeklyComparison, p),
  heartRateToday:   (p) => get(API.dashboard.heartRateToday, p),
};
