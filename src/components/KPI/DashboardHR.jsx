import { useHeartRate, useHeartRateStats, useDailySummary } from "../../hooks/useDashboard";

export default function DashboardHR({ consumidorId }) {
  const { data: tl, isLoading, error } = useHeartRate(consumidorId);
  const { data: kpi }  = useHeartRateStats(consumidorId);
  const { data: daily }= useDailySummary(consumidorId);

  if (isLoading) return <p>Cargando HR…</p>;
  if (error)     return <p>Error: {error.message}</p>;

  return (
    <div className="card">
      <h3>Frecuencia cardiaca</h3>
      <div>
        Promedio: {kpi?.hr_promedio_general} · Min: {kpi?.hr_minimo} · Max: {kpi?.hr_maximo} · Std: {kpi?.hr_desviacion}
      </div>
      <div style={{maxHeight:220, overflow:"auto", border:"1px solid #eee", marginTop:8}}>
        <table width="100%">
          <thead><tr><th>Inicio</th><th>Fin</th><th>HR μ</th><th>HR σ</th></tr></thead>
          <tbody>
            {tl?.map((x,i)=>(
              <tr key={i}>
                <td>{new Date(x.window_start).toLocaleString()}</td>
                <td>{new Date(x.window_end).toLocaleString()}</td>
                <td>{x.heart_rate_mean}</td>
                <td>{x.heart_rate_std}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h4 style={{marginTop:16}}>Hoy</h4>
      <p>HR prom: {daily?.hr_promedio_hoy ?? "–"}</p>
    </div>
  );
}
