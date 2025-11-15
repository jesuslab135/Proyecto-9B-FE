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
      fields={[
        { name: 'nombre', label: 'Nombre', type: 'text' },
        { name: 'intensidad', label: 'Intensidad', type: 'number' },
      ]}
      onSubmit={handleSubmit}
    />
  );
}
import React from 'react';
import CrudForm from '../../../components/admin/CrudForm';
import { adminResourcesService } from '../../../services/AdminResourcesService';

const fields = [
  { name: 'nombre', label: 'Nombre', type: 'text' },
  { name: 'intensidad', label: 'Intensidad', type: 'number', default: 1 },
];

export default function EmocionForm() {
  return (
    <CrudForm
      resourceName="Emoción"
      fields={fields}
      loadItem={(id) => adminResourcesService.getEmocion(id)}
      createItem={(body) => adminResourcesService.createEmocion(body)}
      updateItem={(id, body) => adminResourcesService.updateEmocion(id, body)}
    />
  );
}
