import { useDesiresStats, useDesiresTracking } from "../../hooks/useDashboard";

export default function DesiresPanel({ consumidorId }) {
  const { data: stats, isLoading } = useDesiresStats(consumidorId);
  const { data: track } = useDesiresTracking(consumidorId);

  if (isLoading) return <p>Cargando deseos…</p>;

  return (
    <div className="card">
      <h3>Deseos</h3>
      <ul>
        {(stats||[]).map((s) => (
          <li key={s.deseo_tipo}>
            {s.deseo_tipo}: total {s.total_deseos} · resueltos {s.deseos_resueltos} ({s.porcentaje_resolucion}%)
          </li>
        ))}
      </ul>

      <h4>Timeline</h4>
      <div style={{maxHeight:220, overflow:"auto", border:"1px solid #eee"}}>
        <table width="100%">
          <thead><tr><th>Fecha</th><th>Tipo</th><th>Resuelto</th><th>HR durante</th><th>Prob(urge)</th></tr></thead>
          <tbody>
            {(track||[]).map((d)=>(
              <tr key={d.deseo_id}>
                <td>{new Date(d.fecha_creacion).toLocaleString()}</td>
                <td>{d.deseo_tipo}</td>
                <td>{d.resolved ? "Sí" : "No"}</td>
                <td>{d.heart_rate_durante ?? "–"}</td>
                <td>{d.probabilidad_modelo ?? "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
