import "./Table_users.css";
import React, { useState, useEffect, use } from "react";
import Pagination from "../../../components/Global_components/Pagination";
import { UsuariosAPI } from "../../../utils/api/usuarios.client";
import { Modal } from "react-responsive-modal";

const Table_users = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const itemsPerPage = 5;
  const [page, setPage] = useState(1);

  // Funicon para obtener al lista usuarios

  const fetchUsers = async () => {
    try {
      const res = await UsuariosAPI.list();
      const ordered = (res.results || []).sort((a, b) => a.id - b.id);
      setUsers(ordered);
      setLoading(false);
      console.log("Usuarios obtenidos:", ordered);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Funcion para editar al usuario

  // Funcion para eliminar al usuario

  const eliminarUsuario = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
      await UsuariosAPI.softDelete(id);

      await fetchUsers();

      alert("Usuario eliminado correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el usuario.");
    }
  };

  // Math.ceil redondea hacia arriba al entero más cercano
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Calcular qué datos mostrar
  const start = (page - 1) * itemsPerPage;
  const paginatedData = users.slice(start, start + itemsPerPage);

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
            Cargando usuarios...
          </p>
        ) : (
          <>
            <div className="search-bar-container">
              <div className="search-bar">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Buscar usuario por nombre, email o rol..."
                />
              </div>
              <div className="nvo-usuario-btn">
                <p>Crear nuevo usuario</p>
                <i className="fas fa-plus-circle"></i>
              </div>
            </div>
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((users, index) => (
                    <tr key={index}>
                      <td>
                        <p>{users.id}</p>
                      </td>
                      <td className="datos-usuario">
                        <div className="nombre-permiso">
                          <p>{users.nombre}</p>
                          <span
                            style={{
                              color:
                                users.rol === "Administrador"
                                  ? "#4A90E2"
                                  : "gray",
                            }}
                          >
                            {users.rol}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <p>{users.email}</p>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <p>{users.telefono}</p>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            padding: "1rem",
                            // border: users.status === "Activo" ? "2px solid green" : "2px solid red",
                            // color: users.status === "Activo" ? "green" : "red",
                            borderRadius: "8px",
                            minWidth: "max-content",
                          }}
                        >
                          Activo
                        </span>
                      </td>
                      <td className="acciones-usuario">
                        <button>
                          <i className="fas fa-edit edit-container"></i>
                        </button>
                        <button onClick={() => eliminarUsuario(users.id)}>
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

export default Table_users;
