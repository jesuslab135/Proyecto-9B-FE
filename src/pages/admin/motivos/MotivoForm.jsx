import React, { useEffect, useState } from 'react';
import CrudForm from '../../../components/admin/CrudForm';
import { adminResourcesService } from '../../../services/AdminResourcesService';
import { useNavigate, useParams } from 'react-router-dom';

export default function MotivoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({ descripcion: '' });

  useEffect(() => {
    if (id) {
      adminResourcesService.getMotivo(id).then((res) => setInitialValues(res || {}));
    }
  }, [id]);

  const handleSubmit = async (values) => {
    if (id) {
      await adminResourcesService.updateMotivo(id, values);
    } else {
      await adminResourcesService.createMotivo(values);
    }
    navigate('/admin/motivos');
  };

  return (
    <CrudForm
      title={id ? 'Editar Motivo' : 'Crear Motivo'}
      initialValues={initialValues}
      fields={[{ name: 'descripcion', label: 'Descripción', type: 'text' }]}
      onSubmit={handleSubmit}
    />
  );
}
import React from 'react';
import CrudForm from '../../../components/admin/CrudForm';
import { adminResourcesService } from '../../../services/AdminResourcesService';

const fields = [
  { name: 'texto', label: 'Texto', type: 'textarea' },
  { name: 'importancia', label: 'Importancia', type: 'number', default: 1 },
];

export default function MotivoForm() {
  return (
    <CrudForm
      resourceName="Motivo"
      fields={fields}
      loadItem={(id) => adminResourcesService.getMotivo(id)}
      createItem={(body) => adminResourcesService.createMotivo(body)}
      updateItem={(id, body) => adminResourcesService.updateMotivo(id, body)}
    />
  );
}
