import "./Create_content.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormulariosAPI } from "../../../utils/api/formularios.client";

const Edit_content = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    consumidor_id: "",
    emociones: "",
    motivos: "",
  });
  const [loading, setLoading] = useState(true);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);

  useEffect(() => {
    const fetchFormulario = async () => {
      try {
        const response = await FormulariosAPI.get(id);
        setFormData({
          consumidor_id: response.consumidor_id || "",
          emociones: response.emociones || "",
          motivos: response.motivos || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener formulario:", error);
        alert("Error al cargar el formulario");
        navigate("/admin/formularios");
      }
    };
    fetchFormulario();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const updateFormulario = async () => {
    try {
      await FormulariosAPI.update(id, formData);
      console.log("Formulario actualizado:", formData);
      setIsUpdateSuccessful(true);

      setTimeout(() => {
        navigate("/admin/formularios");
      }, 3000);
    } catch (error) {
      console.error("Error al actualizar formulario:", error);
      alert("Error al actualizar el formulario. Por favor, intenta nuevamente.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consumidor_id.toString().trim()) {
      alert("El ID de consumidor es obligatorio");
      return;
    }
    updateFormulario();
  };

  const handleCancel = () => {
    navigate("/admin/formularios");
  };

  if (loading) {
    return <div className="body-create-usuario"><p>Cargando...</p></div>;
  }

  return (
    <div className="body-create-usuario">
      <h2>Editar formulario</h2>
      {isUpdateSuccessful && (
        <section>✓ Formulario actualizado exitosamente. Redirigiendo...</section>
      )}
      <form className="form-create-usuario" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="consumidor_id">ID del Consumidor *</label>
          <input
            type="number"
            id="consumidor_id"
            name="consumidor_id"
            value={formData.consumidor_id}
            onChange={handleChange}
            placeholder="Ingrese el ID del consumidor"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="emociones">Emociones (separadas por coma)</label>
          <input
            type="text"
            id="emociones"
            name="emociones"
            value={formData.emociones}
            onChange={handleChange}
            placeholder="Ej: Felicidad, Tristeza, Ansiedad"
          />
        </div>

        <div className="form-group">
          <label htmlFor="motivos">Motivos (separados por coma)</label>
          <input
            type="text"
            id="motivos"
            name="motivos"
            value={formData.motivos}
            onChange={handleChange}
            placeholder="Ej: Estrés, Problemas laborales"
          />
        </div>

        <button type="submit" className="btn-create-usuario">
          Actualizar formulario
        </button>
        <button type="button" className="btn-cancelar" onClick={handleCancel}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default Edit_content;
