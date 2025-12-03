import "./Create_content.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmocionesAPI } from "../../../utils/api/emociones.client";

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
    const fetchEmocion = async () => {
      try {
        const response = await EmocionesAPI.get(id);
        setFormData({
          nombre: response.nombre || "",
          descripcion: response.descripcion || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener emoción:", error);
        alert("Error al cargar la emoción");
        navigate("/admin/emociones");
      }
    };
    fetchEmocion();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const updateEmocion = async () => {
    try {
      await EmocionesAPI.update(id, formData);
      console.log("Emoción actualizada:", formData);
      setIsUpdateSuccessful(true);

      setTimeout(() => {
        navigate("/admin/emociones");
      }, 3000);
    } catch (error) {
      console.error("Error al actualizar emoción:", error);
      alert("Error al actualizar la emoción. Por favor, intenta nuevamente.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    updateEmocion();
  };

  const handleCancel = () => {
    navigate("/admin/emociones");
  };

  if (loading) {
    return <div className="body-create-usuario"><p>Cargando...</p></div>;
  }

  return (
    <div className="body-create-usuario">
      <h2>Editar emoción</h2>
      {isUpdateSuccessful && (
        <section>✓ Emoción actualizada exitosamente. Redirigiendo...</section>
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
          Actualizar emoción
        </button>
        <button type="button" className="btn-cancelar" onClick={handleCancel}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default Edit_content;
