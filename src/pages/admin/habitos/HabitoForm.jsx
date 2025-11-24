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
