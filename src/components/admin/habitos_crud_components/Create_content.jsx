import "./Create_content.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HabitosAPI } from "../../../utils/api/habitos.client";

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

  const createHabito = async () => {
    try {
      const response = await HabitosAPI.create(formData);
      console.log("Hábito creado:", response);
      setIsCreateSuccessful(true);

      setTimeout(() => {
        navigate("/admin/habitos");
      }, 3000);
    } catch (error) {
      console.error("Error al crear hábito:", error);
      alert("Error al crear el hábito. Por favor, intenta nuevamente.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    createHabito();
  };

  const handleCancel = () => {
    navigate("/admin/habitos");
  };

  return (
    <div className="body-create-usuario">
      <h2>Crear nuevo hábito</h2>
      {isCreateSuccessful && (
        <section>✓ Hábito creado exitosamente. Redirigiendo...</section>
      )}
      <form className="form-create-usuario" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre del hábito *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Ejercicio diario"
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
            placeholder="Describe el hábito (opcional)"
          />
        </div>

        <button type="submit" className="btn-create-usuario">
          Crear hábito
        </button>
        <button type="button" className="btn-cancelar" onClick={handleCancel}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default Create_content;
