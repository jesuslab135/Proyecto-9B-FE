/**
 * Calculate personal records from desires and predictions data
 * @param {Array} desiresTracking - From /api/dashboard/desires-tracking/
 * @param {Array} predictionTimeline - From /api/dashboard/predictions/
 * @param {Object} heartRateStats - From /api/dashboard/heart-rate-stats/
 * @returns {Object} Personal records object
 */
export const calculatePersonalRecords = (desiresTracking, predictionTimeline, heartRateStats) => {
  
  // ========== RESISTANCE RECORDS ==========
  
  // 1. Longest Resistance Streak
  const longestResistanceStreak = calculateLongestStreak(desiresTracking);
  
  // 2. Current Resistance Streak
  const currentResistanceStreak = calculateCurrentStreak(desiresTracking);
  
  // 3. Fastest Resolution Time (in minutes)
  const fastestResolution = desiresTracking
    .filter(d => d.resolved && d.horas_hasta_resolucion != null)
    .reduce((min, d) => {
      const minutes = d.horas_hasta_resolucion * 60;
      return minutes < min ? minutes : min;
    }, Infinity);
  
  // 4. Most Resistances in One Week
  const mostResistancesInWeek = calculateMaxResistancesInWeek(desiresTracking);
  
  // 5. Most Resistances in One Day
  const mostResistancesInDay = calculateMaxResistancesInDay(desiresTracking);
  
  // ========== CRAVING-FREE RECORDS ==========
  
  // 6. Longest Craving-Free Period (days with no urge_label=1)
  const longestCravingFreePeriod = calculateLongestCravingFreePeriod(predictionTimeline);
  
  // 7. Current Craving-Free Days
  const currentCravingFreeDays = calculateCurrentCravingFreeDays(predictionTimeline);
  
  // 8. Total Craving-Free Days
  const totalCravingFreeDays = calculateTotalCravingFreeDays(predictionTimeline);
  
  // ========== HEALTH RECORDS ==========
  
  // 9. Calmest Day (lowest HR, no cravings)
  const calmestDay = findCalmestDay(predictionTimeline, heartRateStats);
  
  // 10. Best Resistance Week
  const bestResistanceWeek = findBestResistanceWeek(desiresTracking);
  
  return {
    resistance: {
      longestStreak: longestResistanceStreak,
      currentStreak: currentResistanceStreak,
      fastestResolutionMinutes: fastestResolution === Infinity ? 0 : Math.round(fastestResolution),
      mostInWeek: mostResistancesInWeek,
      mostInDay: mostResistancesInDay
    },
    cravingFree: {
      longestPeriodDays: longestCravingFreePeriod,
      currentDays: currentCravingFreeDays,
      totalDays: totalCravingFreeDays
    },
    health: {
      calmestDay: calmestDay,
      bestWeek: bestResistanceWeek
    }
  };
};

// ========== HELPER FUNCTIONS ==========

/**
 * Calculate longest consecutive streak of resolved=true desires
 */
function calculateLongestStreak(desires) {
  if (!desires || desires.length === 0) return 0;
  
  // Sort by creation date (oldest first)
  const sorted = [...desires].sort((a, b) => 
    new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
  );
  
  let maxStreak = 0;
  let currentStreak = 0;
  
  for (const desire of sorted) {
    if (desire.resolved) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return maxStreak;
}

/**
 * Calculate current streak (most recent consecutive resolved=true)
 */
function calculateCurrentStreak(desires) {
  if (!desires || desires.length === 0) return 0;
  
  // Sort by creation date (newest first)
  const sorted = [...desires].sort((a, b) => 
    new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
  );
  
  let streak = 0;
  
  for (const desire of sorted) {
    if (desire.resolved) {
      streak++;
    } else {
      break; // Stop at first unresolved
    }
  }
  
  return streak;
}

/**
 * Calculate max resistances in any 7-day period
 */
function calculateMaxResistancesInWeek(desires) {
  if (!desires || desires.length === 0) return 0;
  
  const resolved = desires.filter(d => d.resolved);
  if (resolved.length === 0) return 0;
  
  // Group by week
  const weekGroups = {};
  
  resolved.forEach(d => {
    const date = new Date(d.fecha_creacion);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week
    const weekKey = weekStart.toISOString().split('T')[0];
    
    weekGroups[weekKey] = (weekGroups[weekKey] || 0) + 1;
  });
  
  return Math.max(...Object.values(weekGroups));
}

/**
 * Calculate max resistances in any single day
 */
function calculateMaxResistancesInDay(desires) {
  if (!desires || desires.length === 0) return 0;
  
  const resolved = desires.filter(d => d.resolved);
  if (resolved.length === 0) return 0;
  
  // Group by date
  const dayGroups = {};
  
  resolved.forEach(d => {
    const dateKey = new Date(d.fecha_creacion).toISOString().split('T')[0];
    dayGroups[dateKey] = (dayGroups[dateKey] || 0) + 1;
  });
  
  return Math.max(...Object.values(dayGroups));
}

/**
 * Calculate longest consecutive days without any urge_label=1 predictions
 */
function calculateLongestCravingFreePeriod(predictions) {
  if (!predictions || predictions.length === 0) return 0;
  
  // Group predictions by date
  const predictionsByDate = {};
  predictions.forEach(p => {
    const dateKey = p.fecha;
    if (!predictionsByDate[dateKey]) {
      predictionsByDate[dateKey] = [];
    }
    predictionsByDate[dateKey].push(p);
  });
  
  // Get sorted list of all dates
  const dates = Object.keys(predictionsByDate).sort();
  if (dates.length === 0) return 0;
  
  let maxStreak = 0;
  let currentStreak = 0;
  
  // Check each date for any urge_label=1
  for (const date of dates) {
    const hasUrge = predictionsByDate[date].some(p => p.urge_label === 1);
    
    if (!hasUrge) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return maxStreak;
}

/**
 * Calculate current consecutive craving-free days
 */
function calculateCurrentCravingFreeDays(predictions) {
  if (!predictions || predictions.length === 0) return 0;
  
  // Group predictions by date
  const predictionsByDate = {};
  predictions.forEach(p => {
    const dateKey = p.fecha;
    if (!predictionsByDate[dateKey]) {
      predictionsByDate[dateKey] = [];
    }
    predictionsByDate[dateKey].push(p);
  });
  
  // Get sorted list of dates (newest first)
  const dates = Object.keys(predictionsByDate).sort().reverse();
  if (dates.length === 0) return 0;
  
  let streak = 0;
  
  for (const date of dates) {
    const hasUrge = predictionsByDate[date].some(p => p.urge_label === 1);
    
    if (!hasUrge) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Calculate total number of craving-free days (not necessarily consecutive)
 */
function calculateTotalCravingFreeDays(predictions) {
  if (!predictions || predictions.length === 0) return 0;
  
  // Group predictions by date
  const predictionsByDate = {};
  predictions.forEach(p => {
    const dateKey = p.fecha;
    if (!predictionsByDate[dateKey]) {
      predictionsByDate[dateKey] = [];
    }
    predictionsByDate[dateKey].push(p);
  });
  
  // Count days without any urge_label=1
  let cravingFreeDays = 0;
  
  Object.values(predictionsByDate).forEach(dayPredictions => {
    const hasUrge = dayPredictions.some(p => p.urge_label === 1);
    if (!hasUrge) {
      cravingFreeDays++;
    }
  });
  
  return cravingFreeDays;
}

/**
 * Find the calmest day (lowest average HR with no cravings)
 */
function findCalmestDay(predictions, heartRateStats) {
  if (!predictions || predictions.length === 0) return null;
  
  // Group predictions by date and calculate stats
  const dayStats = {};
  
  predictions.forEach(p => {
    const dateKey = p.fecha;
    if (!dayStats[dateKey]) {
      dayStats[dateKey] = {
        date: dateKey,
        cravings: 0,
        hasData: false
      };
    }
    
    if (p.urge_label === 1) {
      dayStats[dateKey].cravings++;
    }
  });
  
  // Find day with zero cravings and lowest HR
  // Note: This is simplified - you'd need to fetch actual daily HR data
  const cravingFreeDays = Object.values(dayStats).filter(d => d.cravings === 0);
  
  if (cravingFreeDays.length === 0) return null;
  
  // Return most recent craving-free day as calmest
  // In production, you'd want to fetch actual HR data for each day
  return {
    date: cravingFreeDays[0].date,
    hrMean: heartRateStats?.hr_minimo || 0, // Simplified
    cravings: 0
  };
}

/**
 * Find the week with best resistance rate
 */
function findBestResistanceWeek(desires) {
  if (!desires || desires.length === 0) return null;
  
  // Group by week
  const weekStats = {};
  
  desires.forEach(d => {
    const date = new Date(d.fecha_creacion);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weekStats[weekKey]) {
      weekStats[weekKey] = {
        weekStart: weekKey,
        total: 0,
        resolved: 0
      };
    }
    
    weekStats[weekKey].total++;
    if (d.resolved) {
      weekStats[weekKey].resolved++;
    }
  });
  
  // Find week with highest resistance rate
  let bestWeek = null;
  let bestRate = 0;
  
  Object.values(weekStats).forEach(week => {
    const rate = (week.resolved / week.total) * 100;
    if (rate > bestRate) {
      bestRate = rate;
      bestWeek = {
        weekStart: week.weekStart,
        resistanceRate: Math.round(rate),
        resistances: week.resolved,
        total: week.total
      };
    }
  });
  
  return bestWeek;
}