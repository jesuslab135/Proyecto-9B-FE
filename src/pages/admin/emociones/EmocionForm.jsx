import React, { useEffect, useState } from 'react';
import CrudForm from '../../../components/admin/CrudForm';
import { adminResourcesService } from '../../../services/AdminResourcesService';
import { useNavigate, useParams } from 'react-router-dom';

export default function EmocionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({ nombre: '', intensidad: '' });

  useEffect(() => {
    if (id) {
      adminResourcesService.getEmocion(id).then((res) => setInitialValues(res || {}));
    }
  }, [id]);

  const handleSubmit = async (values) => {
    if (id) {
      await adminResourcesService.updateEmocion(id, values);
    } else {
      await adminResourcesService.createEmocion(values);
    }
    navigate('/admin/emociones');
  };

  return (
    <CrudForm
      title={id ? 'Editar Emoción' : 'Crear Emoción'}
      initialValues={initialValues}
      iconClass="fas fa-heart"
      fields={[
        { name: 'nombre', label: 'Nombre', type: 'text' },
        { name: 'intensidad', label: 'Intensidad', type: 'number' },
      ]}
      onSubmit={handleSubmit}
    />
  );
}