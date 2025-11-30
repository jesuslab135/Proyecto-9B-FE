import "./Table_users.css";
import React, { useState, useEffect } from "react";
import Pagination from "../../../components/Global_components/Pagination";
import { UsuariosAPI } from "../../../utils/api/usuarios.client";
import { Modal } from "react-responsive-modal";

const Table_users = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const itemsPerPage = 5;
  const [page, setPage] = useState(1);

  // const para el Modal
  const [open, setOpen] = useState(false);
  const onCloseModal = () => setOpen(false);
  const onOpenModal = () => setOpen(true);

  // Funicon para obtener al lista usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await UsuariosAPI.list();
        const ordered = (res.results || []).sort((a, b) => a.id - b.id);
        setUsers(ordered);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(true);
      }
    };
    fetchUsers();
  }, []);

  // Funcion para editar al usuario

  // Funcion para eliminar al usuario

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
                        <button onClick={onOpenModal}>
                          <i className="fas fa-edit edit-container"></i>
                        </button>

                        <i className="fas fa-trash-alt delete-container"></i>
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
      <Modal open={open} onClose={onCloseModal} center  container={document.body}>
        <h2>Simple centered modal</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet
          hendrerit risus, sed porttitor quam.
        </p>
      </Modal>
      
      
    </>
  );
};

export default Table_users;
