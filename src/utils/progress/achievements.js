/**
 * Define all available achievements/badges
 */
export const ACHIEVEMENTS = {
  // Resistance Achievements
  FIRST_VICTORY: {
    id: 'first_victory',
    name: 'First Victory',
    icon: '🏆',
    description: 'Resisted your first craving',
    category: 'resistance'
  },
  STRONG_WILL: {
    id: 'strong_will',
    name: 'Strong Will',
    icon: '💪',
    description: '5 cravings resisted in a row',
    category: 'resistance'
  },
  UNSTOPPABLE: {
    id: 'unstoppable',
    name: 'Unstoppable',
    icon: '🔥',
    description: '10 cravings resisted in a row',
    category: 'resistance'
  },
  PERFECT_WEEK: {
    id: 'perfect_week',
    name: 'Perfect Week',
    icon: '⭐',
    description: '7 days with 100% resistance',
    category: 'resistance'
  },
  CRAVING_CRUSHER: {
    id: 'craving_crusher',
    name: 'Craving Crusher',
    icon: '⚔️',
    description: '50 total cravings resisted',
    category: 'resistance'
  },
  QUICK_RESOLVER: {
    id: 'quick_resolver',
    name: 'Quick Resolver',
    icon: '⚡',
    description: 'Average resistance time under 30 minutes',
    category: 'resistance'
  },
  
  // Progress Achievements
  GETTING_HEALTHIER: {
    id: 'getting_healthier',
    name: 'Getting Healthier',
    icon: '📉',
    description: '30% fewer cravings detected this month',
    category: 'progress'
  },
  STABLE_MIND: {
    id: 'stable_mind',
    name: 'Stable Mind',
    icon: '🧘',
    description: '7 consecutive days without cravings',
    category: 'progress'
  },
  MONTH_CHAMPION: {
    id: 'month_champion',
    name: 'Month Champion',
    icon: '🏅',
    description: 'Best resistance rate of any month',
    category: 'progress'
  },
  DATA_WARRIOR: {
    id: 'data_warrior',
    name: 'Data Warrior',
    icon: '📊',
    description: '30 consecutive days of tracking',
    category: 'tracking'
  },
  
  // Recovery Achievements
  COMEBACK_KING: {
    id: 'comeback_king',
    name: 'Comeback King',
    icon: '👑',
    description: 'Bounced back with 5 resistances after setback',
    category: 'recovery'
  },
  SELF_AWARE: {
    id: 'self_aware',
    name: 'Self-Aware',
    icon: '🎯',
    description: 'Consistently marking alerts quickly',
    category: 'awareness'
  }
};

/**
 * Check which achievements the user has earned
 * @param {Object} personalRecords - From calculatePersonalRecords()
 * @param {Object} desiresStats - From /api/dashboard/desires-stats/
 * @param {Object} weeklyComparison - From /api/dashboard/weekly-comparison/
 * @param {Array} desiresTracking - From /api/dashboard/desires-tracking/
 * @returns {Object} { earned: [], nextMilestones: [] }
 */
export const checkAchievements = (personalRecords, desiresStats, weeklyComparison, desiresTracking) => {
  const earned = [];
  const nextMilestones = [];
  
  // Get total resolved desires
  const totalResolved = desiresStats?.deseos_resueltos || 0;
  const currentStreak = personalRecords?.resistance?.currentStreak || 0;
  const longestStreak = personalRecords?.resistance?.longestStreak || 0;
  const avgResolutionTime = desiresStats?.promedio_horas_resolucion || 0;
  const cravingFreeDays = personalRecords?.cravingFree?.currentDays || 0;
  
  // ========== CHECK RESISTANCE ACHIEVEMENTS ==========
  
  // First Victory
  if (totalResolved >= 1) {
    earned.push(ACHIEVEMENTS.FIRST_VICTORY);
  }
  
  // Strong Will (5 in a row)
  if (longestStreak >= 5) {
    earned.push(ACHIEVEMENTS.STRONG_WILL);
  } else {
    nextMilestones.push({
      ...ACHIEVEMENTS.STRONG_WILL,
      progress: currentStreak,
      required: 5,
      progressPercentage: Math.round((currentStreak / 5) * 100)
    });
  }
  
  // Unstoppable (10 in a row)
  if (longestStreak >= 10) {
    earned.push(ACHIEVEMENTS.UNSTOPPABLE);
  } else if (longestStreak >= 5) {
    nextMilestones.push({
      ...ACHIEVEMENTS.UNSTOPPABLE,
      progress: currentStreak,
      required: 10,
      progressPercentage: Math.round((currentStreak / 10) * 100)
    });
  }
  
  // Craving Crusher (50 total)
  if (totalResolved >= 50) {
    earned.push(ACHIEVEMENTS.CRAVING_CRUSHER);
  } else {
    nextMilestones.push({
      ...ACHIEVEMENTS.CRAVING_CRUSHER,
      progress: totalResolved,
      required: 50,
      progressPercentage: Math.round((totalResolved / 50) * 100)
    });
  }
  
  // Quick Resolver (< 30 min average)
  if (avgResolutionTime > 0 && avgResolutionTime * 60 < 30) {
    earned.push(ACHIEVEMENTS.QUICK_RESOLVER);
  }
  
  // ========== CHECK PROGRESS ACHIEVEMENTS ==========
  
  // Stable Mind (7 days craving-free)
  if (cravingFreeDays >= 7) {
    earned.push(ACHIEVEMENTS.STABLE_MIND);
  } else {
    nextMilestones.push({
      ...ACHIEVEMENTS.STABLE_MIND,
      progress: cravingFreeDays,
      required: 7,
      progressPercentage: Math.round((cravingFreeDays / 7) * 100)
    });
  }
  
  // Getting Healthier (30% reduction)
  const desireChange = weeklyComparison?.deseos_semana_anterior > 0
    ? ((weeklyComparison.deseos_semana_anterior - weeklyComparison.deseos_semana_actual) / weeklyComparison.deseos_semana_anterior) * 100
    : 0;
    
  if (desireChange >= 30) {
    earned.push(ACHIEVEMENTS.GETTING_HEALTHIER);
  }
  
  // Data Warrior (check if user has been tracking for 30 days)
  const trackingDays = calculateTrackingDays(desiresTracking);
  if (trackingDays >= 30) {
    earned.push(ACHIEVEMENTS.DATA_WARRIOR);
  } else {
    nextMilestones.push({
      ...ACHIEVEMENTS.DATA_WARRIOR,
      progress: trackingDays,
      required: 30,
      progressPercentage: Math.round((trackingDays / 30) * 100)
    });
  }
  
  return {
    earned,
    nextMilestones: nextMilestones.slice(0, 3) // Show top 3 closest milestones
  };
};

/**
 * Calculate how many days user has been tracking
 */
function calculateTrackingDays(desires) {
  if (!desires || desires.length === 0) return 0;
  
  const dates = new Set(desires.map(d => new Date(d.fecha_creacion).toDateString()));
  return dates.size;
}