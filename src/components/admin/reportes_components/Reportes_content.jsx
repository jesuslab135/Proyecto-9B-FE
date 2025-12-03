import "./Reportes_content.css";

const Reportes_content = () => {
  return (
    <>
      <div className="principal-container">
        <section className="generate-container">
          <h3>Generar Nuevo Reporte</h3>
          <span>
            Define los criterios para una generación rápida y eficiente.
          </span>
          <div>
            <form className="generate-form">
              <div className="form-group">
                <label htmlFor="report-type">Tipo de Reporte:</label>
                <select id="report-type" name="report-type">
                  <option value="mensual">Mensual</option>
                  <option value="semanal">Semanal</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
              <div>
                <label htmlFor="user-select">Selecciona un usuario:</label>
                <select id="user-select" name="user-select">
                  <option value="user1">Usuario 1</option>
                  <option value="user2">Usuario 2</option>
                  <option value="user3">Usuario 3</option>
                </select>
              </div>
              <button type="submit" className="generate-button">
                Generar Reporte
              </button>
            </form>
          </div>
        </section>
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
              <tr>
                <td>Reporte_Mensual_Julio</td>
                <td>2024-07-31</td>
                <td>
                  <button className="download-button">Descargar</button>
                </td>
              </tr>
              <tr>
                <td>Reporte_Semanal_Semana_30</td>
                <td>2024-07-28</td>

                <td>
                  <button className="download-button">Descargar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <div>
            <h3>Logs de la aplicacion</h3>
            <div className="logs-container">
              <h4>
                Descarga los registros del sistema para diagnóstico y auditría
              </h4>
            </div>
          </div>
          <div className="">
            <button className="download-logs-button">Descargar Logs</button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Reportes_content;
