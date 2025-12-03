import "./Table_users.css";
import React, { useState, useEffect, use } from "react";
import Pagination from "../../../components/Global_components/Pagination";
import { UsuariosAPI } from "../../../utils/api/usuarios.client";
import { Modal } from "react-responsive-modal";
import { Link } from "react-router-dom";

const Table_users = () => {
  const [users, setUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);

  const [orderLatest, setOrderLatest] = useState(false);

  const itemsPerPage = 5;
  const [page, setPage] = useState(1);

  // Funcion para obtener al lista usuarios
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

  useEffect(() => {
  setPage(1);
}, [searchTerm]);


  // Funcion para editar al usuario

  // Handle profile update
  // const handleProfileUpdate = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessage({ type: '', text: '' });

  //   try {
  //     await UsuariosAPI.patch(users.id, {
  //       nombre: profileData.nombre,
  //       telefono: profileData.telefono,
  //       // Email usually shouldn't be changed without verification
  //     });

  //     // Update local user data
  //     const updatedUser = { ...users, ...profileData };
  //     authService.currentUser = updatedUser;
  //     localStorage.setItem('user', JSON.stringify(updatedUser));

  //     setMessage({ type: 'success', text: '✓ Perfil actualizado exitosamente' });
  //     logger.info('Profile updated successfully');
  //   } catch (error) {
  //     setMessage({ type: 'error', text: '✗ Error al actualizar perfil' });
  //     logger.error('Profile update failed', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Funcion para eliminar al usuario con Soft Delete
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

  // Filtros dinámicos
  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();

    return (
      user.nombre.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.telefono.includes(term) ||
      user.rol.toLowerCase().includes(term) ||
      (user.is_active == 1 ? "activo" : "inactivo").includes(term)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  

  // Calcular qué datos mostrar
  const start = (page - 1) * itemsPerPage;
  const paginatedData = filteredUsers.slice(start, start + itemsPerPage);

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
                  placeholder="Buscar usuario por nombre, email, teléfono o rol..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Link to="create/" replace className="nvo-usuario-btn">
                <p>Crear nuevo usuario</p>
                <i className="fas fa-plus-circle"></i>
              </Link>
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
                            border:
                              users.is_active == 1
                                ? "2px solid green"
                                : "2px solid red",
                            color: users.is_active == 1 ? "green" : "red",
                            borderRadius: "8px",
                            minWidth: "max-content",
                          }}
                        >
                          {users.is_active == 1 ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="acciones-usuario">
                        {/* <button style={{ cursor: "pointer" }}>
                          <i className="fas fa-edit edit-container"></i>
                        </button> */}
                        <button
                          onClick={() => eliminarUsuario(users.id)}
                          disabled={users.is_active != 1}
                          style={
                            users.is_active != 1
                              ? { cursor: "disabled" }
                              : { cursor: "pointer" }
                          }
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

export default Table_users;
