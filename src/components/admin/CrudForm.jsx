import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function CrudForm({ 
  loadItem, 
  createItem, 
  updateItem, 
  fields = [], 
  resourceName,
  title,
  redirectPath 
}) {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id;
  const displayTitle = title || resourceName || 'Elemento';

  const initial = {};
  fields.forEach((f) => (initial[f.name] = f.default ?? ''));

  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id && loadItem) {
      setLoading(true);
      loadItem(id)
        .then((item) => setForm((prev) => ({ ...prev, ...item })))
        .catch((err) => setError(err.message || String(err)))
        .finally(() => setLoading(false));
    }
  }, [id, loadItem]);

  const handleChange = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

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
      if (redirectPath) {
        navigate(redirectPath);
      } else {
        navigate(-1);
      }
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start pt-10 pb-20 min-h-[80vh]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            {id ? `Editar ${displayTitle}` : `Crear ${displayTitle}`}
          </h2>
          <p className="text-center text-gray-500 text-sm mt-1">
            Complete la información a continuación
          </p>
        </div>

        <div className="p-8">
          {loading && !form.id && id && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {f.label} {f.required && <span className="text-red-500">*</span>}
                </label>
                
                {f.type === 'textarea' ? (
                  <textarea
                    value={form[f.name] || ''}
                    onChange={(e) => handleChange(f.name, e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-y text-gray-700"
                    rows={f.rows || 4}
                    placeholder={f.placeholder || ''}
                    required={f.required}
                  />
                ) : f.type === 'select' ? (
                  <div className="relative">
                    <select
                      value={form[f.name] || ''}
                      onChange={(e) => handleChange(f.name, e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none appearance-none bg-white text-gray-700"
                      required={f.required}
                    >
                      <option value="">Seleccione una opción</option>
                      {f.options && f.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                ) : f.type === 'checkbox' ? (
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={!!form[f.name]}
                      onChange={(e) => handleChange(f.name, e.target.checked)}
                      className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 font-medium">{f.help || f.label}</span>
                  </label>
                ) : (
                  <input
                    type={f.type || 'text'}
                    value={form[f.name] || ''}
                    onChange={(e) => handleChange(f.name, e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-700"
                    placeholder={f.placeholder || ''}
                    required={f.required}
                  />
                )}
                
                {(f.hint || f.helpText) && (
                  <p className="text-xs text-gray-500 mt-1.5 ml-1">
                    {f.hint || f.helpText}
                  </p>
                )}
              </div>
            ))}

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <span>Guardar Cambios</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
