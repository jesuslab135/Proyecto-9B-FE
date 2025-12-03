import "./Create_content.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MotivosAPI } from "../../../utils/api/motivos.client";

const Edit_content = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [loading, setLoading] = useState(true);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);

  useEffect(() => {
    const fetchMotivo = async () => {
      try {
        const response = await MotivosAPI.get(id);
        setFormData({
          nombre: response.nombre || "",
          descripcion: response.descripcion || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener motivo:", error);
        alert("Error al cargar el motivo");
        navigate("/admin/motivos");
      }
    };
    fetchMotivo();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const updateMotivo = async () => {
    try {
      await MotivosAPI.update(id, formData);
      console.log("Motivo actualizado:", formData);
      setIsUpdateSuccessful(true);

      setTimeout(() => {
        navigate("/admin/motivos");
      }, 3000);
    } catch (error) {
      console.error("Error al actualizar motivo:", error);
      alert("Error al actualizar el motivo. Por favor, intenta nuevamente.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    updateMotivo();
  };

  const handleCancel = () => {
    navigate("/admin/motivos");
  };

  if (loading) {
    return <div className="body-create-usuario"><p>Cargando...</p></div>;
  }

  return (
    <div className="body-create-usuario">
      <h2>Editar motivo</h2>
      {isUpdateSuccessful && (
        <section>✓ Motivo actualizado exitosamente. Redirigiendo...</section>
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
          Actualizar motivo
        </button>
        <button type="button" className="btn-cancelar" onClick={handleCancel}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default Edit_content;
