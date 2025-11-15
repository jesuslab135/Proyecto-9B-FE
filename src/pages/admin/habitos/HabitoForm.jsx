import React, { useEffect, useState } from 'react';
import CrudForm from '../../../components/admin/CrudForm';
import { adminResourcesService } from '../../../services/AdminResourcesService';
import { useNavigate, useParams } from 'react-router-dom';

export default function HabitoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({ titulo: '', frecuencia: '' });

  useEffect(() => {
    if (id) {
      adminResourcesService.getHabito(id).then((res) => setInitialValues(res || {}));
    }
  }, [id]);

  const handleSubmit = async (values) => {
    if (id) {
      await adminResourcesService.updateHabito(id, values);
    } else {
      await adminResourcesService.createHabito(values);
    }
    navigate('/admin/habitos');
  };

  return (
    <CrudForm
      title={id ? 'Editar Hábito' : 'Crear Hábito'}
      initialValues={initialValues}
      fields={[
        { name: 'titulo', label: 'Título', type: 'text' },
        { name: 'frecuencia', label: 'Frecuencia', type: 'text' },
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
  { name: 'frecuencia', label: 'Frecuencia', type: 'text' },
];

export default function HabitoForm() {
  return (
    <CrudForm
      resourceName="Hábito"
      fields={fields}
      loadItem={(id) => adminResourcesService.getHabito(id)}
      createItem={(body) => adminResourcesService.createHabito(body)}
      updateItem={(id, body) => adminResourcesService.updateHabito(id, body)}
    />
  );
}
