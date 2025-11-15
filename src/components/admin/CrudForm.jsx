import React, { useState } from 'react';

export default function CrudForm({ title, initialValues = {}, fields = [], onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => setValues(initialValues), [initialValues]);

  const handleChange = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(values);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <form onSubmit={submit} className="space-y-4 max-w-md">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-medium mb-1">{f.label}</label>
            <input
              type={f.type || 'text'}
              value={values[f.name] ?? ''}
              onChange={handleChange(f.name)}
              className="w-full border p-2 rounded"
            />
          </div>
        ))}
        <div>
          <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function CrudForm({ loadItem, createItem, updateItem, fields, resourceName }) {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id;

  const initial = {};
  fields.forEach(f => initial[f.name] = f.default ?? '');

  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id && loadItem) {
      setLoading(true);
      loadItem(id).then(item => {
        setForm(prev => ({ ...prev, ...item }));
      }).catch(err => setError(err.message || String(err))).finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (name, value) => setForm(prev => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (id && updateItem) {
        await updateItem(id, form);
      } else if (createItem) {
        await createItem(form);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">{id ? `Editar ${resourceName}` : `Crear ${resourceName}`}</h2>
      {loading && <p>⏳ Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(f => (
          <div key={f.name}>
            <label className="block text-sm font-medium mb-1">{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea value={form[f.name] || ''} onChange={e => handleChange(f.name, e.target.value)} className="w-full border rounded p-2" />
            ) : f.type === 'checkbox' ? (
              <input type="checkbox" checked={!!form[f.name]} onChange={e => handleChange(f.name, e.target.checked)} />
            ) : (
              <input type={f.type || 'text'} value={form[f.name] || ''} onChange={e => handleChange(f.name, e.target.value)} className="w-full border rounded p-2" />
            )}
          </div>
        ))}

        <div className="flex gap-2">
          <button type="submit" className="btn-primary">Guardar</button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function CrudForm({ loadItem, createItem, updateItem, fields, resourceName }) {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id;

  const initial = {};
  fields.forEach(f => initial[f.name] = f.default ?? '');

  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id && loadItem) {
      setLoading(true);
      loadItem(id).then(item => {
        setForm(prev => ({ ...prev, ...item }));
      }).catch(err => setError(err.message || String(err))).finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (name, value) => setForm(prev => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (id && updateItem) {
        await updateItem(id, form);
      } else if (createItem) {
        await createItem(form);
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">{id ? `Editar ${resourceName}` : `Crear ${resourceName}`}</h2>
      {loading && <p>⏳ Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(f => (
          <div key={f.name}>
            <label className="block text-sm font-medium mb-1">{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea value={form[f.name] || ''} onChange={e => handleChange(f.name, e.target.value)} className="w-full border rounded p-2" />
            ) : f.type === 'checkbox' ? (
              <input type="checkbox" checked={!!form[f.name]} onChange={e => handleChange(f.name, e.target.checked)} />
            ) : (
              <input type={f.type || 'text'} value={form[f.name] || ''} onChange={e => handleChange(f.name, e.target.value)} className="w-full border rounded p-2" />
            )}
          </div>
        ))}

        <div className="flex gap-2">
          <button type="submit" className="btn-primary">Guardar</button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
