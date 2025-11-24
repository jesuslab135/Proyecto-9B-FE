import { useEffect, useState } from 'react';
import { 
  useDesiresTracking, 
  useDesiresStats, 
  useWeeklyComparison, 
  usePredictionTimeline, 
  useHeartRateStats 
} from '../../hooks/useDashboard';
import { calculatePersonalRecords } from '../../utils/progress/personalRecords';
import { checkAchievements } from '../../utils/progress/achievements';
import { authService } from '../../services/AuthService';
import './MiProgreso.css';

export default function MiProgreso() {
  const user = authService.getCurrentUser();
  const consumidorId = user?.consumidor_id || 1;
  
  // Fetch all necessary data
  const { data: desiresTracking, isLoading: loadingTracking } = useDesiresTracking(consumidorId);
  const { data: desiresStats, isLoading: loadingStats } = useDesiresStats(consumidorId);
  const { data: weeklyComparison, isLoading: loadingWeekly } = useWeeklyComparison(consumidorId);
  const { data: predictionTimeline, isLoading: loadingPredictions } = usePredictionTimeline(consumidorId);
  const { data: heartRateStats, isLoading: loadingHR } = useHeartRateStats(consumidorId);
  
  const [personalRecords, setPersonalRecords] = useState(null);
  const [achievements, setAchievements] = useState({ earned: [], nextMilestones: [] });
  
  const isLoading = loadingTracking || loadingStats || loadingWeekly || loadingPredictions || loadingHR;
  
  useEffect(() => {
    if (desiresTracking && predictionTimeline && heartRateStats) {
      // Calculate personal records
      const records = calculatePersonalRecords(
        desiresTracking, 
        predictionTimeline, 
        heartRateStats[0] || {}
      );
      setPersonalRecords(records);
      
      // Check achievements
      const achievementData = checkAchievements(
        records, 
        desiresStats?.[0] || {}, 
        weeklyComparison?.[0] || {}, 
        desiresTracking
      );
      setAchievements(achievementData);
    }
  }, [desiresTracking, predictionTimeline, heartRateStats, desiresStats, weeklyComparison]);
  
  if (isLoading) {
    return (
      <div className="mi-progreso-loading">
        <div className="loading-spinner"></div>
        <p>Cargando tu progreso...</p>
      </div>
    );
  }
  
  if (!personalRecords) {
    return (
      <div className="mi-progreso-empty">
        <p>No hay suficientes datos para mostrar tu progreso aún.</p>
        <p>Sigue usando la app y vuelve pronto!</p>
      </div>
    );
  }
  
  return (
    <div className="mi-progreso-container">
      {/* Header Section */}
      <div className="progreso-header">
        <h1>Mi Progreso</h1>
        <p className="progreso-subtitle">Tu viaje hacia una vida más saludable</p>
      </div>
      
      {/* Current Stats Overview */}
      <section className="current-stats">
        <h2>📊 Estado Actual</h2>
        <div className="stats-grid">
          <div className="stat-card highlight">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-value">{personalRecords.resistance.currentStreak}</div>
              <div className="stat-label">Racha Actual</div>
              <div className="stat-sublabel">resistencias consecutivas</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🧘</div>
            <div className="stat-content">
              <div className="stat-value">{personalRecords.cravingFree.currentDays}</div>
              <div className="stat-label">Días Sin Antojos</div>
              <div className="stat-sublabel">período actual</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">
                {desiresStats?.[0]?.porcentaje_resolucion?.toFixed(0) || 0}%
              </div>
              <div className="stat-label">Tasa de Resistencia</div>
              <div className="stat-sublabel">total histórico</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <div className="stat-value">
                {desiresStats?.[0]?.promedio_horas_resolucion 
                  ? `${Math.round(desiresStats[0].promedio_horas_resolucion * 60)} min`
                  : 'N/A'}
              </div>
              <div className="stat-label">Tiempo Promedio</div>
              <div className="stat-sublabel">para resistir</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Weekly Comparison */}
      {weeklyComparison && weeklyComparison[0] && (
        <section className="weekly-comparison">
          <h2>📈 Comparación Semanal</h2>
          <div className="comparison-content">
            <div className="comparison-item">
              <div className="comparison-label">Antojos Esta Semana</div>
              <div className="comparison-value">
                {weeklyComparison[0].deseos_semana_actual}
              </div>
            </div>
            
            <div className="comparison-arrow">
              {weeklyComparison[0].deseos_semana_actual < weeklyComparison[0].deseos_semana_anterior 
                ? '📉' 
                : weeklyComparison[0].deseos_semana_actual > weeklyComparison[0].deseos_semana_anterior
                  ? '📈'
                  : '➡️'
              }
            </div>
            
            <div className="comparison-item">
              <div className="comparison-label">Semana Anterior</div>
              <div className="comparison-value">
                {weeklyComparison[0].deseos_semana_anterior}
              </div>
            </div>
            
            {weeklyComparison[0].deseos_semana_anterior > 0 && (
              <div className="comparison-change">
                {weeklyComparison[0].deseos_semana_actual < weeklyComparison[0].deseos_semana_anterior ? (
                  <span className="change-positive">
                    🎉 {Math.round(
                      ((weeklyComparison[0].deseos_semana_anterior - weeklyComparison[0].deseos_semana_actual) / 
                      weeklyComparison[0].deseos_semana_anterior) * 100
                    )}% menos antojos esta semana!
                  </span>
                ) : weeklyComparison[0].deseos_semana_actual > weeklyComparison[0].deseos_semana_anterior ? (
                  <span className="change-negative">
                    ⚠️ {Math.round(
                      ((weeklyComparison[0].deseos_semana_actual - weeklyComparison[0].deseos_semana_anterior) / 
                      weeklyComparison[0].deseos_semana_anterior) * 100
                    )}% más antojos esta semana. ¡Tú puedes!
                  </span>
                ) : (
                  <span className="change-neutral">
                    ➡️ Mismo nivel que la semana anterior
                  </span>
                )}
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* Personal Records Section */}
      <section className="personal-records">
        <h2>🏅 Tus Récords Personales</h2>
        
        <div className="records-grid">
          <div className="record-card">
            <div className="record-icon">🔥</div>
            <div className="record-value">{personalRecords.resistance.longestStreak}</div>
            <div className="record-label">Racha Más Larga</div>
            <div className="record-description">resistencias consecutivas</div>
          </div>
          
          <div className="record-card">
            <div className="record-icon">⚡</div>
            <div className="record-value">
              {personalRecords.resistance.fastestResolutionMinutes > 0 
                ? `${personalRecords.resistance.fastestResolutionMinutes} min`
                : 'N/A'}
            </div>
            <div className="record-label">Resistencia Más Rápida</div>
            <div className="record-description">tiempo récord</div>
          </div>
          
          <div className="record-card">
            <div className="record-icon">🧘</div>
            <div className="record-value">{personalRecords.cravingFree.longestPeriodDays} días</div>
            <div className="record-label">Periodo Sin Antojos</div>
            <div className="record-description">mayor racha</div>
          </div>
          
          <div className="record-card">
            <div className="record-icon">💪</div>
            <div className="record-value">{personalRecords.resistance.mostInWeek}</div>
            <div className="record-label">Mejor Semana</div>
            <div className="record-description">resistencias en 7 días</div>
          </div>
          
          <div className="record-card">
            <div className="record-icon">🎯</div>
            <div className="record-value">{personalRecords.resistance.mostInDay}</div>
            <div className="record-label">Mejor Día</div>
            <div className="record-description">resistencias en un día</div>
          </div>
          
          <div className="record-card">
            <div className="record-icon">📅</div>
            <div className="record-value">{personalRecords.cravingFree.totalDays}</div>
            <div className="record-label">Días Sin Antojos</div>
            <div className="record-description">total acumulado</div>
          </div>
        </div>
        
        {personalRecords.health.calmestDay && (
          <div className="calmest-day-card">
            <h3>🌟 Tu Día Más Tranquilo</h3>
            <p>
              <strong>{new Date(personalRecords.health.calmestDay.date).toLocaleDateString('es-ES')}</strong>
              {' - '}Sin antojos detectados
              {personalRecords.health.calmestDay.hrMean > 0 && 
                ` con frecuencia cardíaca de ${Math.round(personalRecords.health.calmestDay.hrMean)} bpm`
              }
            </p>
          </div>
        )}
        
        {personalRecords.health.bestWeek && (
          <div className="best-week-card">
            <h3>⭐ Tu Mejor Semana</h3>
            <p>
              Semana del <strong>{new Date(personalRecords.health.bestWeek.weekStart).toLocaleDateString('es-ES')}</strong>
              {' - '}
              <strong>{personalRecords.health.bestWeek.resistanceRate}% de resistencia</strong>
              {' '}({personalRecords.health.bestWeek.resistances}/{personalRecords.health.bestWeek.total} antojos resistidos)
            </p>
          </div>
        )}
      </section>
      
      {/* Achievements Section */}
      <section className="achievements">
        <h2>🏆 Logros Desbloqueados</h2>
        
        {achievements.earned.length > 0 ? (
          <div className="achievements-grid">
            {achievements.earned.map(achievement => (
              <div key={achievement.id} className="achievement-badge earned">
                <div className="badge-icon">{achievement.icon}</div>
                <div className="badge-name">{achievement.name}</div>
                <div className="badge-description">{achievement.description}</div>
                <div className="badge-earned-label">✓ Desbloqueado</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-achievements">
            <p>Aún no has desbloqueado ningún logro.</p>
            <p>¡Sigue resistiendo antojos para ganar tus primeras insignias!</p>
          </div>
        )}
        
        {achievements.nextMilestones.length > 0 && (
          <>
            <h3>🎯 Próximos Hitos</h3>
            <div className="milestones-list">
              {achievements.nextMilestones.map(milestone => (
                <div key={milestone.id} className="milestone-card">
                  <div className="milestone-header">
                    <span className="milestone-icon">{milestone.icon}</span>
                    <div className="milestone-info">
                      <span className="milestone-name">{milestone.name}</span>
                      <span className="milestone-description">{milestone.description}</span>
                    </div>
                  </div>
                  <div className="milestone-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${milestone.progressPercentage}%` }}
                      />
                    </div>
                    <span className="progress-text">
                      {milestone.progress} / {milestone.required} ({milestone.progressPercentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}