import "./Table_users.css";

const Table_users = () => {
  const users = [
    {
      id: 1,
      name: "Juan Pérez",
      email: "gagor203@gmnial.com",
      status: "Activo",
      role: "Administrador",
      cellphone: "555-1234",
    },
    {
      id: 1,
      name: "Juan Pérez",
      email: "gagor203@gmnial.com",
      status: "Activo",
      role: "Administrador",
      cellphone: "555-1234",
    },
    {
      id: 1,
      name: "Juan Pérez",
      email: "gagor203@gmnial.com",
      status: "Activo",
      role: "Administrador",
      cellphone: "555-1234",
    },
    {
      id: 1,
      name: "Juan Pérez",
      email: "gagor203@gmnial.com",
      status: "Activo",
      role: "Administrador",
      cellphone: "555-1234",
    },
    {
      id: 1,
      name: "Juan Pérez",
      email: "gagor203@gmnial.com",
      status: "Activo",
      role: "Administrador",
      cellphone: "555-1234",
    },
    {
      id: 1,
      name: "Juan Pérez",
      email: "gagor203@gmnial.com",
      status: "Activo",
      role: "Administrador",
      cellphone: "555-1234",
    },
  ];

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
              {users.map((users, index) => (
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
            <button className="pagination">
              <p>Anterior</p>
            </button>
            <button className="pagination active">
              <p>1</p>
            </button>
            <button className="pagination">
              <p>2</p>
            </button>
            <button className="pagination">
              <p>3</p>
            </button>
            <button className="pagination">
              <p>Siguiente</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table_users;
