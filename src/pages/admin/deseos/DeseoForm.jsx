import React from 'react';
import CrudForm from '../../../components/admin/CrudForm';
import { adminResourcesService } from '../../../services/AdminResourcesService';

const fields = [
  { name: 'titulo', label: 'Título', type: 'text' },
  { name: 'descripcion', label: 'Descripción', type: 'textarea' },
  { name: 'resuelto', label: 'Resuelto', type: 'checkbox', default: false },
];

export default function DeseoForm() {
  return (
    <CrudForm
      resourceName="Deseo"
      fields={fields}
      loadItem={(id) => adminResourcesService.getDeseo(id)}
      createItem={(body) => adminResourcesService.createDeseo(body)}
      updateItem={(id, body) => adminResourcesService.updateDeseo(id, body)}
    />
  );
}
