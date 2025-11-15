import React from 'react';
import CrudForm from '../../../components/admin/CrudForm';
import { adminResourcesService } from '../../../services/AdminResourcesService';

const fields = [
  { name: 'titulo', label: 'Título', type: 'text' },
  { name: 'contenido', label: 'Contenido', type: 'textarea' },
];

export default function FormularioForm() {
  return (
    <CrudForm
      resourceName="Formulario"
      fields={fields}
      loadItem={(id) => adminResourcesService.getFormulario(id)}
      createItem={(body) => adminResourcesService.createFormulario(body)}
      updateItem={(id, body) => adminResourcesService.updateFormulario(id, body)}
    />
  );
}