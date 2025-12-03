import "./Table_habitos.css";
import React, { useState, useEffect } from "react";
import Pagination from "../../../components/Global_components/Pagination";
import { HabitosAPI } from "../../../utils/api/habitos.client";
import { Link } from "react-router-dom";

const Table_habitos = () => {
  const [habitos, setHabitos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 5;
  const [page, setPage] = useState(1);

  // Función para obtener la lista de hábitos
  const fetchHabitos = async () => {
    try {
      const res = await HabitosAPI.list();
      const ordered = (res.results || []).sort((a, b) => a.id - b.id);
      setHabitos(ordered);
      setLoading(false);
      console.log("Hábitos obtenidos:", ordered);
    } catch (error) {
      console.error("Error fetching habitos:", error);
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchHabitos();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // Función para eliminar el hábito
  const eliminarHabito = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este hábito?")) return;

    try {
      await HabitosAPI.remove(id);
      await fetchHabitos();
      alert("Hábito eliminado correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el hábito.");
    }
  };

  // Filtros dinámicos
  const filteredHabitos = habitos.filter((habito) => {
    const term = searchTerm.toLowerCase();
    return (
      habito.nombre.toLowerCase().includes(term) ||
      (habito.descripcion && habito.descripcion.toLowerCase().includes(term))
    );
  });

  const totalPages = Math.ceil(filteredHabitos.length / itemsPerPage);

  // Calcular qué datos mostrar
  const start = (page - 1) * itemsPerPage;
  const paginatedData = filteredHabitos.slice(start, start + itemsPerPage);

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
            Cargando hábitos...
          </p>
        ) : (
          <>
            <div className="search-bar-container">
              <div className="search-bar">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Buscar hábito por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Link to="create/" replace className="nvo-usuario-btn">
                <p>Crear nuevo hábito</p>
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
                  {paginatedData.map((habito, index) => (
                    <tr key={index}>
                      <td>
                        <p>{habito.id}</p>
                      </td>
                      <td className="datos-usuario">
                        <div className="nombre-permiso">
                          <p>{habito.nombre}</p>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <p>{habito.descripcion || "—"}</p>
                      </td>
                      <td className="acciones-usuario">
                        <Link to={`edit/${habito.id}`} style={{ cursor: "pointer" }}>
                          <i className="fas fa-edit edit-container"></i>
                        </Link>
                        <button
                          onClick={() => eliminarHabito(habito.id)}
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

export default Table_habitos;
