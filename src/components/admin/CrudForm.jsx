import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CrudForm.css';

export default function CrudForm({ title, initialValues = {}, fields = [], onSubmit, iconClass = "fas fa-edit" }) {
  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => setValues(initialValues), [initialValues]);

  const handleChange = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(values);
    } catch (error) {
        console.error("Error saving form:", error);
        alert("Error al guardar. Por favor intente nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
      navigate(-1);
  };

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <div className="crud-form-icon">
            <i className={iconClass}></i>
        </div>
        <div className="crud-form-title">
            <h2>{title}</h2>
        </div>
      </div>
      
      <div className="crud-form-card">
        <form onSubmit={submit}>
            {fields.map((f) => (
            <div key={f.name} className="crud-form-group">
                <label className="crud-form-label">{f.label}</label>
                {f.type === 'textarea' ? (
                    <textarea
                        value={values[f.name] ?? ''}
                        onChange={handleChange(f.name)}
                        className="crud-form-input"
                        rows={4}
                    />
                ) : (
                    <input
                        type={f.type || 'text'}
                        value={values[f.name] ?? ''}
                        onChange={handleChange(f.name)}
                        className="crud-form-input"
                    />
                )}
            </div>
            ))}
            <div className="crud-form-actions">
                <button className="crud-btn crud-btn-secondary" type="button" onClick={handleCancel} disabled={saving}>
                    Cancelar
                </button>
                <button className="crud-btn crud-btn-primary" type="submit" disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}