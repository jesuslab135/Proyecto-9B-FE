import "./Table_formularios.css";
import React, { useState, useEffect } from "react";
import Pagination from "../../../components/Global_components/Pagination";
import { FormulariosAPI } from "../../../utils/api/formularios.client";
import { Link } from "react-router-dom";

const Table_formularios = () => {
  const [formularios, setFormularios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 5;
  const [page, setPage] = useState(1);

  // Función para obtener la lista de formularios
  const fetchFormularios = async () => {
    try {
      const res = await FormulariosAPI.list();
      const ordered = (res.results || []).sort((a, b) => a.id - b.id);
      setFormularios(ordered);
      setLoading(false);
      console.log("Formularios obtenidos:", ordered);
    } catch (error) {
      console.error("Error fetching formularios:", error);
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchFormularios();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // Función para eliminar el formulario
  const eliminarFormulario = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este formulario?")) return;

    try {
      await FormulariosAPI.remove(id);
      await fetchFormularios();
      alert("Formulario eliminado correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el formulario.");
    }
  };

  // Filtros dinámicos
  const filteredFormularios = formularios.filter((formulario) => {
    const term = searchTerm.toLowerCase();
    return (
      (formulario.consumidor_id && formulario.consumidor_id.toString().includes(term)) ||
      (formulario.emociones && formulario.emociones.toLowerCase().includes(term)) ||
      (formulario.motivos && formulario.motivos.toLowerCase().includes(term))
    );
  });

  const totalPages = Math.ceil(filteredFormularios.length / itemsPerPage);

  // Calcular qué datos mostrar
  const start = (page - 1) * itemsPerPage;
  const paginatedData = filteredFormularios.slice(start, start + itemsPerPage);

  return (
    <>
      <div className="container">
        {loading ? (
          <p
            style={{
              display: "flex",
              alignContent: "center",
              textAlign: "center",
              width: "100%",
              height: "100%",
            }}
          >
            Cargando formularios...
          </p>
        ) : (
          <>
            <div className="search-bar-container">
              <div className="search-bar">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Buscar formulario por consumidor, emociones o motivos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Link to="create/" replace className="nvo-usuario-btn">
                <p>Crear nuevo formulario</p>
                <i className="fas fa-plus-circle"></i>
              </Link>
            </div>
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Consumidor ID</th>
                    <th>Emociones</th>
                    <th>Motivos</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((formulario, index) => (
                    <tr key={index}>
                      <td>
                        <p>{formulario.id}</p>
                      </td>
                      <td className="datos-usuario">
                        <div className="nombre-permiso">
                          <p>{formulario.consumidor_id || "—"}</p>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <p>{formulario.emociones || "—"}</p>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <p>{formulario.motivos || "—"}</p>
                      </td>
                      <td className="acciones-usuario">
                        <Link to={`edit/${formulario.id}`} style={{ cursor: "pointer" }}>
                          <i className="fas fa-edit edit-container"></i>
                        </Link>
                        <button
                          onClick={() => eliminarFormulario(formulario.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <i className="fas fa-trash-alt delete-container"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination-container">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Table_formularios;
