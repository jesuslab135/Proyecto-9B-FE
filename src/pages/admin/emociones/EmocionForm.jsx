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
