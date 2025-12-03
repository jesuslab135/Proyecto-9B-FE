import "./Create_content.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DeseosAPI } from "../../../utils/api/deseos.client";

const Edit_content = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    tipo_deseo: "",
    intensidad: "",
    resolved: false,
  });
  const [loading, setLoading] = useState(true);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);

  useEffect(() => {
    const fetchDeseo = async () => {
      try {
        const response = await DeseosAPI.get(id);
        setFormData({
          tipo_deseo: response.tipo_deseo || "",
          intensidad: response.intensidad || "",
          resolved: response.resolved || false,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener deseo:", error);
        alert("Error al cargar el deseo");
        navigate("/admin/deseos");
      }
    };
    fetchDeseo();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const updateDeseo = async () => {
    try {
      await DeseosAPI.update(id, formData);
      console.log("Deseo actualizado:", formData);
      setIsUpdateSuccessful(true);

      setTimeout(() => {
        navigate("/admin/deseos");
      }, 3000);
    } catch (error) {
      console.error("Error al actualizar deseo:", error);
      alert("Error al actualizar el deseo. Por favor, intenta nuevamente.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.tipo_deseo.trim()) {
      alert("El tipo de deseo es obligatorio");
      return;
    }
    updateDeseo();
  };

  const handleCancel = () => {
    navigate("/admin/deseos");
  };

  if (loading) {
    return <div className="body-create-usuario"><p>Cargando...</p></div>;
  }

  return (
    <div className="body-create-usuario">
      <h2>Editar deseo</h2>
      {isUpdateSuccessful && (
        <section>✓ Deseo actualizado exitosamente. Redirigiendo...</section>
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
          Actualizar deseo
        </button>
        <button type="button" className="btn-cancelar" onClick={handleCancel}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default Edit_content;
