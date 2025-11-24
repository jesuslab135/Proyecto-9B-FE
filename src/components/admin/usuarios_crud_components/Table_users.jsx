import "./Table_users.css";
import React, {useState, useEffect} from "react";
import Pagination from "../../../components/Global_components/Pagination";

const Table_users = () => {

  // const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const itemsPerPage = 5;
  const [page, setPage] = useState(1);

  const usersData = [
    {
      id: 1,
      name: "Juan Pérez",
      role: "Consumidor",
      email: "user@gmail.com", 
      cellphone: "555-1234",
      status: "Inactivo"
    },
    {
      id: 2,
      name: "Juan Pérez",
      role: "Administrador",
      email: "user@gmail.com", 
      cellphone: "555-1234",
      status: "Activo"
    }, 
    {
      id: 3,
      name: "Juan Pérez",
      role: "Administrador",
      email: "user@gmail.com", 
      cellphone: "555-1234",
      status: "Activo"
    }, 
    {
      id: 4,
      name: "Juan Pérez",
      role: "Administrador",
      email: "user@gmail.com", 
      cellphone: "555-1234",
      status: "Activo"
    }, 
    {
      id: 5,
      name: "Juan Pérez",
      role: "Administrador",
      email: "user@gmail.com", 
      cellphone: "555-1234",
      status: "Activo"
    }, 
    {
      id: 6,
      name: "Juan Pérez",
      role: "Administrador",
      email: "user@gmail.com", 
      cellphone: "555-1234",
      status: "Activo"
    }, 
    {
      id: 7,
      name: "Juan Pérez",
      role: "Administrador",
      email: "user@gmail.com", 
      cellphone: "555-1234",
      status: "Activo"
    }
  ]

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await fetch("http://127.0.0.1:8000/api/usuarios/");
  //       const json = await response.json();
  //       setUsers(json);
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUsers();
  //   // console.log('q se imprime:', json);
  // }, []);

  // Math.ceil redondea hacia arriba al entero más cercano
  const totalPages = Math.ceil(usersData.length / itemsPerPage);

  // Calcular qué datos mostrar
  const start = (page - 1) * itemsPerPage;
  const paginatedData = usersData.slice(start, start + itemsPerPage);

  return (
    <>
      <div className="container">
        {loading ? <p style={{display: "flex", alignContent: "center", textAlign:"center", width:"100%", height: "100%"}}>Cargando usuarios...</p> : (
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
                      <p>{users.name}</p>
                      <span style={{
                        color: users.role === "Administrador" ? "#4A90E2" : "gray"
                        }}>{users.role}</span>
                    </div>
                  </td>
                  <td style={{textAlign:"center"}}>
                    <p>{users.email}</p>
                  </td>
                  <td style={{textAlign:"center"}}>
                    <p>{users.cellphone}</p>
                  </td>
                  <td style={{textAlign: "center"}}>
                    <span
                    style={{
                      padding: "1rem", 
                      border: users.status === "Activo" ? "2px solid green" : "2px solid red",
                      color: users.status === "Activo" ? "green" : "red",
                      borderRadius: "8px",
                      minWidth: "max-content"
                    }}
                    >{users.status}</span>
                  </td>
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
        </> 
)}
        
      </div>
    </>
  );
};

export default Table_users;
