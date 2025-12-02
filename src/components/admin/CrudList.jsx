import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Global_components/Pagination';
import './CrudList.css';

export default function CrudList({ 
  title, 
  subtitle, 
  iconClass = "fas fa-cogs", 
  fetchList, 
  onDelete, 
  createPath, 
  editPathPrefix, 
  columns = [] 
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchList()
      .then((res) => {
        if (mounted) {
          if (Array.isArray(res)) {
            setItems(res);
          } else if (res && Array.isArray(res.results)) {
            setItems(res.results);
          } else if (res && Array.isArray(res.data)) {
            setItems(res.data);
          } else {
            setItems([]);
            console.warn('CrudList: fetchList did not return an array or expected object structure', res);
          }
        }
      })
      .catch((err) => {
        console.error('CrudList: Error fetching list', err);
        if (mounted) setItems([]);
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [fetchList]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
        await onDelete(id);
        setItems((s) => s.filter((i) => i.id !== id));
    }
  };

  // Filter items
  const filteredItems = items.filter(item => {
    if (!searchTerm) return true;
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const paginatedData = filteredItems.slice(start, start + itemsPerPage);

  return (
    <>
      <div className="crud-header">
        <div className="crud-header-icon">
          <i className={iconClass}></i>
        </div>
        <div className="crud-header-titles">
          <h2>{title}</h2>
          <h3>{subtitle}</h3>
        </div>
      </div>

      <div className="crud-container">
        {loading ? (
           <p style={{display: "flex", alignContent: "center", textAlign:"center", width:"100%", height: "100%"}}>Cargando...</p>
        ) : (
          <>
            <div className="crud-search-bar-container">
              <div className="crud-search-bar">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                  }}
                />
              </div>
              <Link className="crud-create-btn" to={createPath}>
                <p>Crear nuevo</p>
                <i className="fas fa-plus-circle"></i>
              </Link>
            </div>

            <div className="crud-table-container">
              <table className="crud-table">
                <thead>
                  <tr>
                    {columns.map((col, idx) => (
                      <th key={idx}>{col.header}</th>
                    ))}
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item) => (
                    <tr key={item.id}>
                      {columns.map((col, idx) => (
                        <td key={idx}>
                          {col.render ? col.render(item) : item[col.accessor]}
                        </td>
                      ))}
                      <td className="crud-actions">
                        <Link className="crud-action-btn crud-edit-btn" to={`${editPathPrefix}/${item.id}`}>
                          <i className="fas fa-edit"></i>
                        </Link>
                        <div className="crud-action-btn crud-delete-btn" onClick={() => handleDelete(item.id)}>
                          <i className="fas fa-trash-alt"></i>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedData.length === 0 && (
                      <tr>
                          <td colSpan={columns.length + 1} style={{textAlign: 'center'}}>No se encontraron resultados</td>
                      </tr>
                  )}
                </tbody>
              </table>
              
              {totalPages > 1 && (
                  <div className="crud-pagination-container">
                    <Pagination 
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
