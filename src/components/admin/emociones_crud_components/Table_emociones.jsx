import "./Table_emociones.css";
import React, { useState, useEffect } from "react";
import Pagination from "../../../components/Global_components/Pagination";
import { EmocionesAPI } from "../../../utils/api/emociones.client";
import { Link } from "react-router-dom";

const Table_emociones = () => {
  const [emociones, setEmociones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 5;
  const [page, setPage] = useState(1);

  // Función para obtener la lista de emociones
  const fetchEmociones = async () => {
    try {
      const res = await EmocionesAPI.list();
      const ordered = (res.results || []).sort((a, b) => a.id - b.id);
      setEmociones(ordered);
      setLoading(false);
      console.log("Emociones obtenidas:", ordered);
    } catch (error) {
      console.error("Error fetching emociones:", error);
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchEmociones();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // Función para eliminar la emoción
  const eliminarEmocion = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta emoción?")) return;

    try {
      await EmocionesAPI.remove(id);
      await fetchEmociones();
      alert("Emoción eliminada correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la emoción.");
    }
  };

  // Filtros dinámicos
  const filteredEmociones = emociones.filter((emocion) => {
    const term = searchTerm.toLowerCase();
    return (
      emocion.nombre.toLowerCase().includes(term) ||
      (emocion.descripcion && emocion.descripcion.toLowerCase().includes(term))
    );
  });

  const totalPages = Math.ceil(filteredEmociones.length / itemsPerPage);

  // Calcular qué datos mostrar
  const start = (page - 1) * itemsPerPage;
  const paginatedData = filteredEmociones.slice(start, start + itemsPerPage);

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
            Cargando emociones...
          </p>
        ) : (
          <>
            <div className="search-bar-container">
              <div className="search-bar">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Buscar emoción por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Link to="create/" replace className="nvo-usuario-btn">
                <p>Crear nueva emoción</p>
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
                  {paginatedData.map((emocion, index) => (
                    <tr key={index}>
                      <td>
                        <p>{emocion.id}</p>
                      </td>
                      <td className="datos-usuario">
                        <div className="nombre-permiso">
                          <p>{emocion.nombre}</p>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <p>{emocion.descripcion || "—"}</p>
                      </td>
                      <td className="acciones-usuario">
                        <Link to={`edit/${emocion.id}`} style={{ cursor: "pointer" }}>
                          <i className="fas fa-edit edit-container"></i>
                        </Link>
                        <button
                          onClick={() => eliminarEmocion(emocion.id)}
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

export default Table_emociones;
