import React from 'react';
import { Link } from 'react-router-dom';

export default function CrudList({ resourceName, fetchList, onDelete, createPath, editPathPrefix, renderItem }) {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchList()
      .then((res) => {
        if (mounted) setItems(res || []);
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [fetchList]);

  const handleDelete = async (id) => {
    await onDelete(id);
    setItems((s) => s.filter((i) => i.id !== id));
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{resourceName}</h2>
        <Link className="btn btn-primary" to={createPath}>Crear</Link>
      </div>

      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="grid gap-2">
          {items.map((item) => (
            <div key={item.id} className="p-3 border rounded flex justify-between items-center">
              <div>{renderItem ? renderItem(item) : JSON.stringify(item)}</div>
              <div className="space-x-2">
                <Link className="btn btn-secondary" to={`${editPathPrefix}/${item.id}`}>Editar</Link>
                <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function CrudList({ fetchList, onDelete, resourceName, renderItem, createPath, editPathPrefix }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchList();
      setItems(data || []);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este elemento?')) return;
    try {
      await onDelete(id);
      load();
    } catch (err) {
      alert('Error eliminando: ' + (err.message || err));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{resourceName}</h2>
        {createPath && <Link to={createPath} className="btn">Crear</Link>}
      </div>

      {loading && <p>⏳ Cargando...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <div className="space-y-3">
        {items.length === 0 && !loading && <p className="text-sm text-gray-500">No hay registros</p>}
        {items.map(item => (
          <div key={item.id} className="p-4 bg-white rounded shadow-sm flex items-center justify-between">
            <div className="flex-1">{renderItem(item)}</div>
            <div className="ml-4 flex gap-2">
              {editPathPrefix && <Link to={`${editPathPrefix}/${item.id}`} className="text-blue-600">Editar</Link>}
              <button onClick={() => handleDelete(item.id)} className="text-red-600">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function CrudList({ fetchList, onDelete, resourceName, renderItem, createPath, editPathPrefix }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchList();
      setItems(data || []);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este elemento?')) return;
    try {
      await onDelete(id);
      load();
    } catch (err) {
      alert('Error eliminando: ' + (err.message || err));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{resourceName}</h2>
        {createPath && <Link to={createPath} className="btn">Crear</Link>}
      </div>

      {loading && <p>⏳ Cargando...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <div className="space-y-3">
        {items.length === 0 && !loading && <p className="text-sm text-gray-500">No hay registros</p>}
        {items.map(item => (
          <div key={item.id} className="p-4 bg-white rounded shadow-sm flex items-center justify-between">
            <div className="flex-1">{renderItem(item)}</div>
            <div className="ml-4 flex gap-2">
              {editPathPrefix && <Link to={`${editPathPrefix}/${item.id}`} className="text-blue-600">Editar</Link>}
              <button onClick={() => handleDelete(item.id)} className="text-red-600">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
