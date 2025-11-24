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