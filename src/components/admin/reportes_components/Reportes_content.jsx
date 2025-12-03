import "./Reportes_content.css";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf"; 
import { UsuariosAPI } from "../../../utils/api/usuarios.client";

const Reportes_content = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await UsuariosAPI.list();
      const ordered = (res.results || []).sort((a, b) => a.id - b.id);
      setUsers(ordered);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [reportType, setReportType] = useState("mensual");
  const [selectedUser, setSelectedUser] = useState("");

  const [generatedReports, setGeneratedReports] = useState([]);

  const buildReportName = () => {
    const date = new Date().toISOString().slice(0, 10);
    const userName = users.find((u) => u.id == selectedUser)?.nombre || "Usuario";

    return `Reporte_${reportType}_${userName}_${date}`;
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();

    const newReport = {
      id: Date.now(),
      name: buildReportName(),
      date: new Date().toISOString().slice(0, 10),
      user: users.find((u) => u.id == selectedUser)?.nombre,
      type: reportType,
    };

    setGeneratedReports([newReport, ...generatedReports]);
    alert("Reporte generado correctamente");
  };

  // ✅ GENERAR Y DESCARGAR PDF REAL
  const handleDownload = (rep) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Reporte del Sistema", 20, 20);

    doc.setFontSize(12);
    doc.text(`Nombre del reporte: ${rep.name}`, 20, 40);
    doc.text(`Fecha de creación: ${rep.date}`, 20, 50);
    doc.text(`Usuario: ${rep.user}`, 20, 60);
    doc.text(`Tipo de reporte: ${rep.type}`, 20, 70);

    doc.line(20, 80, 190, 80); // línea divisora

    doc.text("Este documento es un reporte generado automáticamente.", 20, 95);
    doc.text("Para fines de auditoría y control interno.", 20, 105);

    doc.text("__________________________", 20, 150);
    doc.text("Firma responsable", 20, 160);

    // Pie de página
    doc.setFontSize(10);
    doc.text("Addictless • © 2025", 20, 280);

    doc.save(`${rep.name}.pdf`);
  };

  const handleDownloadLogs = () => {
    alert("Simulando descarga de logs del sistema...");
  };

  return (
    <>
      <div className="principal-container">

        {/* GENERADOR */}
        <section className="generate-container">
          <h3>Generar Nuevo Reporte</h3>
          <span>Define los criterios para una generación rápida y eficiente.</span>

          <form className="generate-form" onSubmit={handleGenerateReport}>
            <div className="form-group">
              <label htmlFor="report-type">Tipo de Reporte:</label>
              <select
                id="report-type"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="mensual">Mensual</option>
                <option value="semanal">Semanal</option>
                <option value="anual">Anual</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="user-select">Selecciona un usuario:</label>
              <select
                id="user-select"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Seleccione un usuario...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nombre}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="generate-button">
              Generar Reporte
            </button>
          </form>
        </section>

        {/* LISTA DE REPORTES */}
        <section>
          <h3>Reportes Generados</h3>

          <table className="reportes-table">
            <thead>
              <tr>
                <th>Nombre del Reporte</th>
                <th>Fecha de Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {generatedReports.map((rep) => (
                <tr key={rep.id}>
                  <td>{rep.name}</td>
                  <td>{rep.date}</td>
                  <td>
                    <button
                      className="download-button"
                      onClick={() => handleDownload(rep)}
                    >
                      Descargar PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* LOGS */}
        <section>
          <h3>Logs de la aplicación</h3>
          <div className="logs-container">
            <h4>Descarga los registros del sistema para diagnóstico y auditoría</h4>
          </div>

          <button className="download-logs-button" onClick={handleDownloadLogs}>
            Descargar Logs
          </button>
        </section>
      </div>
    </>
  );
};

export default Reportes_content;
