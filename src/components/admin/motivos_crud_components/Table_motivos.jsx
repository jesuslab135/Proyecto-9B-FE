import "./Table_motivos.css";
import React, { useState, useEffect } from "react";
import Pagination from "../../../components/Global_components/Pagination";
import { MotivosAPI } from "../../../utils/api/motivos.client";
import { Link } from "react-router-dom";

const Table_motivos = () => {
  const [motivos, setMotivos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 5;
  const [page, setPage] = useState(1);

  // Función para obtener la lista de motivos
  const fetchMotivos = async () => {
    try {
      const res = await MotivosAPI.list();
      const ordered = (res.results || []).sort((a, b) => a.id - b.id);
      setMotivos(ordered);
      setLoading(false);
      console.log("Motivos obtenidos:", ordered);
    } catch (error) {
      console.error("Error fetching motivos:", error);
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchMotivos();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // Función para eliminar el motivo
  const eliminarMotivo = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este motivo?")) return;

    try {
      await MotivosAPI.remove(id);
      await fetchMotivos();
      alert("Motivo eliminado correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el motivo.");
    }
  };

  // Filtros dinámicos
  const filteredMotivos = motivos.filter((motivo) => {
    const term = searchTerm.toLowerCase();
    return (
      motivo.nombre.toLowerCase().includes(term) ||
      (motivo.descripcion && motivo.descripcion.toLowerCase().includes(term))
    );
  });

  const totalPages = Math.ceil(filteredMotivos.length / itemsPerPage);

  // Calcular qué datos mostrar
  const start = (page - 1) * itemsPerPage;
  const paginatedData = filteredMotivos.slice(start, start + itemsPerPage);

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
            Cargando motivos...
          </p>
        ) : (
          <>
            <div className="search-bar-container">
              <div className="search-bar">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Buscar motivo por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Link to="create/" replace className="nvo-usuario-btn">
                <p>Crear nuevo motivo</p>
                <i className="fas fa-plus-circle"></i>
              </Link>
            </div>
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((motivo, index) => (
                    <tr key={index}>
                      <td>
                        <p>{motivo.id}</p>
                      </td>
                      <td className="datos-usuario">
                        <div className="nombre-permiso">
                          <p>{motivo.nombre}</p>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <p>{motivo.descripcion || "—"}</p>
                      </td>
                      <td className="acciones-usuario">
                        <Link to={`edit/${motivo.id}`} style={{ cursor: "pointer" }}>
                          <i className="fas fa-edit edit-container"></i>
                        </Link>
                        <button
                          onClick={() => eliminarMotivo(motivo.id)}
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

export default Table_motivos;
