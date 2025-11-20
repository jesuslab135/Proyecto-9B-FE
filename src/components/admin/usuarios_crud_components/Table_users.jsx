import "./Table_users.css";
import React, {useState, useEffect} from "react";
import Pagination from "../../../components/Global_components/Pagination";

const Table_users = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const itemsPerPage = 5;
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        
        const response = await fetch("http://127.0.0.1:8000/api/usuarios/");
        const json = await response.json();
        setUsers(json);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    // console.log('q se imprime:', json);
  }, []);

  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  // Math.ceil redondea hacia arriba al entero más cercano
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Calcular qué datos mostrar
  const start = (page - 1) * itemsPerPage;
  const paginatedData = users.slice(start, start + itemsPerPage);

  return (
    <>
      <div className="container">
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
                      <p>{users.name}</p>
                      <span>{users.role}</span>
                    </div>
                  </td>
                  <td>
                    <p>{users.email}</p>
                  </td>
                  <td>
                    <p>{users.cellphone}</p>
                  </td>
                  <td>{users.status}</td>
                  <td className="acciones-usuario">
                    <i className="fas fa-edit edit-container"></i>
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
        
      </div>
    </>
  );
};

export default Table_users;
