import "./Create_content.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HabitosAPI } from "../../../utils/api/habitos.client";

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
    const fetchHabito = async () => {
      try {
        const response = await HabitosAPI.get(id);
        setFormData({
          nombre: response.nombre || "",
          descripcion: response.descripcion || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener hábito:", error);
        alert("Error al cargar el hábito");
        navigate("/admin/habitos");
      }
    };
    fetchHabito();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const updateHabito = async () => {
    try {
      await HabitosAPI.update(id, formData);
      console.log("Hábito actualizado:", formData);
      setIsUpdateSuccessful(true);

      setTimeout(() => {
        navigate("/admin/habitos");
      }, 3000);
    } catch (error) {
      console.error("Error al actualizar hábito:", error);
      alert("Error al actualizar el hábito. Por favor, intenta nuevamente.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    updateHabito();
  };

  const handleCancel = () => {
    navigate("/admin/habitos");
  };

  if (loading) {
    return <div className="body-create-usuario"><p>Cargando...</p></div>;
  }

  return (
    <div className="body-create-usuario">
      <h2>Editar hábito</h2>
      {isUpdateSuccessful && (
        <section>✓ Hábito actualizado exitosamente. Redirigiendo...</section>
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
          Actualizar hábito
        </button>
        <button type="button" className="btn-cancelar" onClick={handleCancel}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default Edit_content;
