import DashboardHR from "../../components/KPI/DashboardHR";
import DesiresPanel from "../../components/KPI/DesiresPanel";

export default function DashboardPage() {
  const consumidorId = 1; // cambiar de acuerdo al usuario logueado cuando haya auth
  return (
    <div style={{display:"grid", gap:16, padding:16}}>
      <DashboardHR consumidorId={consumidorId} />
      <DesiresPanel consumidorId={consumidorId} />
    </div>
  );
}
