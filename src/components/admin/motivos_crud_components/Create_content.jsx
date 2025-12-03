import "./Create_content.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MotivosAPI } from "../../../utils/api/motivos.client";

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

  const createMotivo = async () => {
    try {
      const response = await MotivosAPI.create(formData);
      console.log("Motivo creado:", response);
      setIsCreateSuccessful(true);

      setTimeout(() => {
        navigate("/admin/motivos");
      }, 3000);
    } catch (error) {
      console.error("Error al crear motivo:", error);
      alert("Error al crear el motivo. Por favor, intenta nuevamente.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    createMotivo();
  };

  const handleCancel = () => {
    navigate("/admin/motivos");
  };

  return (
    <div className="body-create-usuario">
      <h2>Crear nuevo motivo</h2>
      {isCreateSuccessful && (
        <section>✓ Motivo creado exitosamente. Redirigiendo...</section>
      )}
      <form className="form-create-usuario" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre del motivo *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Estrés laboral, Problemas familiares"
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
            placeholder="Describe el motivo (opcional)"
          />
        </div>

        <button type="submit" className="btn-create-usuario">
          Crear motivo
        </button>
        <button type="button" className="btn-cancelar" onClick={handleCancel}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default Create_content;
