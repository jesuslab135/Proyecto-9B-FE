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
