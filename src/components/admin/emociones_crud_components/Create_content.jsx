import "./Create_content.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmocionesAPI } from "../../../utils/api/emociones.client";

const Create_content = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  const [isCreateSuccessful, setIsCreateSuccessful] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const createEmocion = async () => {
    try {
      const response = await EmocionesAPI.create(formData);
      console.log("Emoción creada:", response);
      setIsCreateSuccessful(true);

      setTimeout(() => {
        navigate("/admin/emociones");
      }, 3000);
    } catch (error) {
      console.error("Error al crear emoción:", error);
      alert("Error al crear la emoción. Por favor, intenta nuevamente.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    createEmocion();
  };

  const handleCancel = () => {
    navigate("/admin/emociones");
  };

  return (
    <div className="body-create-usuario">
      <h2>Crear nueva emoción</h2>
      {isCreateSuccessful && (
        <section>✓ Emoción creada exitosamente. Redirigiendo...</section>
      )}
      <form className="form-create-usuario" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre de la emoción *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Alegría, Tristeza, Ansiedad"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describe la emoción (opcional)"
          />
        </div>

        <button type="submit" className="btn-create-usuario">
          Crear emoción
        </button>
        <button type="button" className="btn-cancelar" onClick={handleCancel}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default Create_content;
