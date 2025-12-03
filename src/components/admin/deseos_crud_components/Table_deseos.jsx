import "./Table_deseos.css";
import React, { useState, useEffect } from "react";
import Pagination from "../../../components/Global_components/Pagination";
import { DeseosAPI } from "../../../utils/api/deseos.client";
import { Link } from "react-router-dom";

const Table_deseos = () => {
  const [deseos, setDeseos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 5;
  const [page, setPage] = useState(1);

  // Función para obtener la lista de deseos
  const fetchDeseos = async () => {
    try {
      const res = await DeseosAPI.list();
      const ordered = (res.results || []).sort((a, b) => a.id - b.id);
      setDeseos(ordered);
      setLoading(false);
      console.log("Deseos obtenidos:", ordered);
    } catch (error) {
      console.error("Error fetching deseos:", error);
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchDeseos();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // Función para resolver el deseo
  const resolverDeseo = async (id) => {
    if (!confirm("¿Marcar este deseo como resuelto?")) return;

    try {
      await DeseosAPI.resolve(id);
      await fetchDeseos();
      alert("Deseo resuelto correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al resolver el deseo.");
    }
  };

  // Función para eliminar el deseo
  const eliminarDeseo = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este deseo?")) return;

    try {
      await DeseosAPI.remove(id);
      await fetchDeseos();
      alert("Deseo eliminado correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el deseo.");
    }
  };

  // Filtros dinámicos
  const filteredDeseos = deseos.filter((deseo) => {
    const term = searchTerm.toLowerCase();
    return (
      (deseo.tipo_deseo && deseo.tipo_deseo.toLowerCase().includes(term)) ||
      (deseo.intensidad && deseo.intensidad.toLowerCase().includes(term))
    );
  });

  const totalPages = Math.ceil(filteredDeseos.length / itemsPerPage);

  // Calcular qué datos mostrar
  const start = (page - 1) * itemsPerPage;
  const paginatedData = filteredDeseos.slice(start, start + itemsPerPage);

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
            Cargando deseos...
          </p>
        ) : (
          <>
            <div className="search-bar-container">
              <div className="search-bar">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Buscar deseo por tipo o intensidad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Link to="create/" replace className="nvo-usuario-btn">
                <p>Crear nuevo deseo</p>
                <i className="fas fa-plus-circle"></i>
              </Link>
            </div>
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tipo de Deseo</th>
                    <th>Intensidad</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((deseo, index) => (
                    <tr key={index}>
                      <td>
                        <p>{deseo.id}</p>
                      </td>
                      <td className="datos-usuario">
                        <div className="nombre-permiso">
                          <p>{deseo.tipo_deseo}</p>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <p>{deseo.intensidad || "—"}</p>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            padding: "0.5rem 1rem",
                            border: deseo.resolved
                              ? "2px solid green"
                              : "2px solid orange",
                            color: deseo.resolved ? "green" : "orange",
                            borderRadius: "8px",
                          }}
                        >
                          {deseo.resolved ? "Resuelto" : "Pendiente"}
                        </span>
                      </td>
                      <td className="acciones-usuario">
                        {!deseo.resolved && (
                          <button
                            onClick={() => resolverDeseo(deseo.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <i
                              className="fas fa-check-circle"
                              style={{
                                border: "2px solid green",
                                color: "green",
                                padding: "1rem",
                                borderRadius: "8px",
                              }}
                            ></i>
                          </button>
                        )}
                        <Link to={`edit/${deseo.id}`} style={{ cursor: "pointer" }}>
                          <i className="fas fa-edit edit-container"></i>
                        </Link>
                        <button
                          onClick={() => eliminarDeseo(deseo.id)}
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

export default Table_deseos;
