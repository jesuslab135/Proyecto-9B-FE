import { useQuery } from "@tanstack/react-query";
import { DashboardAPI } from "../utils/api/dashboard.client";

const useQueryHelper = (k, fn) => useQuery({ queryKey: k, queryFn: fn });

export const useHeartRate         = (consumidor_id) => useQueryHelper(["dash","hr", consumidor_id||"all"], () => DashboardAPI.heartRate(consumidor_id?{consumidor_id}:undefined));
export const useHeartRateStats    = (consumidor_id) => useQueryHelper(["dash","hrStats", consumidor_id||"all"], () => DashboardAPI.heartRateStats(consumidor_id?{consumidor_id}:undefined));
export const usePredictionTimeline= (consumidor_id) => useQueryHelper(["dash","predTL", consumidor_id||"all"], () => DashboardAPI.predictionTimeline(consumidor_id?{consumidor_id}:undefined));
export const usePredictionSummary = (consumidor_id) => useQueryHelper(["dash","predSum", consumidor_id||"all"], () => DashboardAPI.predictionSummary(consumidor_id?{consumidor_id}:undefined));
export const useDesiresTracking   = (consumidor_id) => useQueryHelper(["dash","dTrack", consumidor_id||"all"], () => DashboardAPI.desiresTracking(consumidor_id?{consumidor_id}:undefined));
export const useDesiresStats      = (consumidor_id) => useQueryHelper(["dash","dStats", consumidor_id||"all"], () => DashboardAPI.desiresStats(consumidor_id?{consumidor_id}:undefined));
export const useDailySummary      = (consumidor_id) => useQueryHelper(["dash","daily", consumidor_id||"all"], () => DashboardAPI.dailySummary(consumidor_id?{consumidor_id}:undefined));
export const useWeeklyComparison  = (consumidor_id) => useQueryHelper(["dash","weekly", consumidor_id||"all"], () => DashboardAPI.weeklyComparison(consumidor_id?{consumidor_id}:undefined));
