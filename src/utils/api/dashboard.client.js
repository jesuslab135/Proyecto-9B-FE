import { http } from "./http";
import { API } from "./endpoints";

const get = (path, params) => http.get(`/${path}/`, { params }).then(r => r.data);

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
};
