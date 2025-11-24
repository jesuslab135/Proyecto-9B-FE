import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CrudList({
  fetchList,
  onDelete,
  // Props aliases for compatibility
  title, resourceName,
  createLink, createPath,
  editLinkBase, editPathPrefix,
  columns,
  renderItem,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Normalize props
  const displayTitle = title || resourceName;
  const pathCreate = createLink || createPath;
  const pathEdit = editLinkBase || editPathPrefix;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchList();
      let itemsData = data || [];

      // Normalize response
      if (!Array.isArray(itemsData)) {
        if (itemsData?.results) itemsData = itemsData.results;
        else if (typeof itemsData === "object") itemsData = Object.values(itemsData);
        else itemsData = [];
      }

      setItems(itemsData);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [fetchList]);

  const handleDelete = async (id) => {
    if (!confirm(`¿Eliminar este registro?`)) return;

    try {
      await onDelete(id);
      load();
    } catch (err) {
      alert("Error eliminando: " + (err.message || err));
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            {displayTitle}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Cargando..." : `${items.length} registro(s)`}
          </p>
        </div>

        {pathCreate && (
          <Link
            to={pathCreate}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Crear nuevo</span>
          </Link>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          Error: {error}
        </div>
      )}

      {/* Content */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-white rounded-xl shadow-sm animate-pulse"></div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No hay registros</h3>
            <p className="mt-1 text-gray-500">Comienza creando un nuevo elemento.</p>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns ? (
                    columns.map((col, idx) => (
                      <th
                        key={col.key || idx}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        {col.label}
                      </th>
                    ))
                  ) : (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Descripción
                    </th>
                  )}
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {columns ? (
                      columns.map((col, idx) => (
                        <td
                          key={col.key || idx}
                          className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"
                        >
                          {col.render ? col.render(item) : item[col.key]}
                        </td>
                      ))
                    ) : (
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {renderItem
                          ? renderItem(item)
                          : item.nombre ||
                            item.titulo ||
                            item.descripcion ||
                            `ID: ${item.id}`}
                      </td>
                    )}
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {pathEdit && (
                          <Link
                            to={`${pathEdit}/${item.id}`}
                            className="text-indigo-600 hover:text-indigo-900 p-1.5 hover:bg-indigo-50 rounded transition"
                            title="Editar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </Link>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 p-1.5 hover:bg-red-50 rounded transition"
                          title="Eliminar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
