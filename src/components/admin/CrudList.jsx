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
