import "./Create_content.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormulariosAPI } from "../../../utils/api/formularios.client";

const Create_content = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    consumidor_id: "",
    emociones: "",
    motivos: "",
  });

  const [isCreateSuccessful, setIsCreateSuccessful] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const createFormulario = async () => {
    try {
      const response = await FormulariosAPI.create(formData);
      console.log("Formulario creado:", response);
      setIsCreateSuccessful(true);

      setTimeout(() => {
        navigate("/admin/formularios");
      }, 3000);
    } catch (error) {
      console.error("Error al crear formulario:", error);
      alert("Error al crear el formulario. Por favor, intenta nuevamente.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consumidor_id.trim()) {
      alert("El ID de consumidor es obligatorio");
      return;
    }
    createFormulario();
  };

  const handleCancel = () => {
    navigate("/admin/formularios");
  };

  return (
    <div className="body-create-usuario">
      <h2>Crear nuevo formulario</h2>
      {isCreateSuccessful && (
        <section>✓ Formulario creado exitosamente. Redirigiendo...</section>
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
          Crear formulario
        </button>
        <button type="button" className="btn-cancelar" onClick={handleCancel}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default Create_content;
