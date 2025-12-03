import "./Create_content.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeseosAPI } from "../../../utils/api/deseos.client";

const Create_content = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tipo_deseo: "",
    intensidad: "",
    resolved: false,
  });

  const [isCreateSuccessful, setIsCreateSuccessful] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const createDeseo = async () => {
    try {
      const response = await DeseosAPI.create(formData);
      console.log("Deseo creado:", response);
      setIsCreateSuccessful(true);

      setTimeout(() => {
        navigate("/admin/deseos");
      }, 3000);
    } catch (error) {
      console.error("Error al crear deseo:", error);
      alert("Error al crear el deseo. Por favor, intenta nuevamente.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.tipo_deseo.trim()) {
      alert("El tipo de deseo es obligatorio");
      return;
    }
    createDeseo();
  };

  const handleCancel = () => {
    navigate("/admin/deseos");
  };

  return (
    <div className="body-create-usuario">
      <h2>Crear nuevo deseo</h2>
      {isCreateSuccessful && (
        <section>✓ Deseo creado exitosamente. Redirigiendo...</section>
      )}
      <form className="form-create-usuario" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tipo_deseo">Tipo de deseo *</label>
          <input
            type="text"
            id="tipo_deseo"
            name="tipo_deseo"
            value={formData.tipo_deseo}
            onChange={handleChange}
            placeholder="Ej: Fumar, Beber, Comer dulces"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="intensidad">Intensidad</label>
          <select
            id="intensidad"
            name="intensidad"
            value={formData.intensidad}
            onChange={handleChange}
          >
            <option value="">Seleccionar intensidad</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="muy_alta">Muy Alta</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="resolved">
            <input
              type="checkbox"
              id="resolved"
              name="resolved"
              checked={formData.resolved}
              onChange={handleChange}
              style={{ width: "auto", marginRight: "0.5rem" }}
            />
            ¿Deseo resuelto?
          </label>
        </div>

        <button type="submit" className="btn-create-usuario">
          Crear deseo
        </button>
        <button type="button" className="btn-cancelar" onClick={handleCancel}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default Create_content;
