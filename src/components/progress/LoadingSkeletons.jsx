import './LoadingSkeletons.css';

// Skeleton for stat cards
export function StatCardSkeleton() {
  return (
    <div className="stat-card skeleton-card">
      <div className="skeleton-icon"></div>
      <div className="stat-content">
        <div className="skeleton-line skeleton-value"></div>
        <div className="skeleton-line skeleton-label"></div>
        <div className="skeleton-line skeleton-sublabel"></div>
      </div>
    </div>
  );
}

// Skeleton for current stats section
export function CurrentStatsSkeleton() {
  return (
    <section className="current-stats">
      <h2>📊 Estado Actual</h2>
      <div className="stats-grid">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    </section>
  );
}

// Skeleton for weekly comparison
export function WeeklyComparisonSkeleton() {
  return (
    <section className="weekly-comparison">
      <h2>📈 Comparación Semanal</h2>
      <div className="comparison-content">
        <div className="comparison-item">
          <div className="skeleton-line" style={{ width: '120px', height: '16px' }}></div>
          <div className="skeleton-line" style={{ width: '80px', height: '48px', marginTop: '8px' }}></div>
        </div>
        <div className="skeleton-line" style={{ width: '60px', height: '48px' }}></div>
        <div className="comparison-item">
          <div className="skeleton-line" style={{ width: '120px', height: '16px' }}></div>
          <div className="skeleton-line" style={{ width: '80px', height: '48px', marginTop: '8px' }}></div>
        </div>
      </div>
    </section>
  );
}

// Skeleton for record cards
export function RecordCardSkeleton() {
  return (
    <div className="record-card skeleton-card">
      <div className="skeleton-icon-large"></div>
      <div className="skeleton-line" style={{ width: '80px', height: '32px', margin: '0.5rem auto' }}></div>
      <div className="skeleton-line" style={{ width: '120px', height: '16px', margin: '0.5rem auto' }}></div>
      <div className="skeleton-line" style={{ width: '100px', height: '14px', margin: '0.25rem auto' }}></div>
    </div>
  );
}

// Skeleton for personal records section
export function PersonalRecordsSkeleton() {
  return (
    <section className="personal-records">
      <h2>🏅 Tus Récords Personales</h2>
      <div className="records-grid">
        <RecordCardSkeleton />
        <RecordCardSkeleton />
        <RecordCardSkeleton />
        <RecordCardSkeleton />
        <RecordCardSkeleton />
        <RecordCardSkeleton />
      </div>
    </section>
  );
}

// Skeleton for achievements
export function AchievementsSkeleton() {
  return (
    <section className="achievements">
      <h2>🏆 Logros Desbloqueados</h2>
      <div className="achievements-grid">
        <div className="achievement-badge skeleton-card">
          <div className="skeleton-icon-large"></div>
          <div className="skeleton-line" style={{ width: '120px', height: '18px', margin: '0.5rem auto' }}></div>
          <div className="skeleton-line" style={{ width: '160px', height: '14px', margin: '0.5rem auto' }}></div>
        </div>
        <div className="achievement-badge skeleton-card">
          <div className="skeleton-icon-large"></div>
          <div className="skeleton-line" style={{ width: '120px', height: '18px', margin: '0.5rem auto' }}></div>
          <div className="skeleton-line" style={{ width: '160px', height: '14px', margin: '0.5rem auto' }}></div>
        </div>
        <div className="achievement-badge skeleton-card">
          <div className="skeleton-icon-large"></div>
          <div className="skeleton-line" style={{ width: '120px', height: '18px', margin: '0.5rem auto' }}></div>
          <div className="skeleton-line" style={{ width: '160px', height: '14px', margin: '0.5rem auto' }}></div>
        </div>
      </div>
    </section>
  );
}

// Skeleton for milestones
export function MilestonesSkeleton() {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>🎯 Próximos Hitos</h3>
      <div className="milestones-list">
        <div className="milestone-card skeleton-card">
          <div className="milestone-header">
            <div className="skeleton-icon-medium"></div>
            <div style={{ flex: 1 }}>
              <div className="skeleton-line" style={{ width: '150px', height: '18px', marginBottom: '0.5rem' }}></div>
              <div className="skeleton-line" style={{ width: '200px', height: '14px' }}></div>
            </div>
          </div>
          <div className="milestone-progress">
            <div className="progress-bar">
              <div className="skeleton-progress-fill"></div>
            </div>
            <div className="skeleton-line" style={{ width: '100px', height: '14px' }}></div>
          </div>
        </div>
        <div className="milestone-card skeleton-card">
          <div className="milestone-header">
            <div className="skeleton-icon-medium"></div>
            <div style={{ flex: 1 }}>
              <div className="skeleton-line" style={{ width: '150px', height: '18px', marginBottom: '0.5rem' }}></div>
              <div className="skeleton-line" style={{ width: '200px', height: '14px' }}></div>
            </div>
          </div>
          <div className="milestone-progress">
            <div className="progress-bar">
              <div className="skeleton-progress-fill"></div>
            </div>
            <div className="skeleton-line" style={{ width: '100px', height: '14px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}