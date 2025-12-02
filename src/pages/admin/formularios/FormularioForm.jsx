import React, { useEffect, useState } from 'react';
import CrudForm from '../../../components/admin/CrudForm';
import { adminResourcesService } from '../../../services/AdminResourcesService';
import { useNavigate, useParams } from 'react-router-dom';

export default function FormularioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({ titulo: '', contenido: '' });

  useEffect(() => {
    if (id) {
      adminResourcesService.getFormulario(id).then((res) => setInitialValues(res || {}));
    }
  }, [id]);

  const handleSubmit = async (values) => {
    if (id) {
      await adminResourcesService.updateFormulario(id, values);
    } else {
      await adminResourcesService.createFormulario(values);
    }
    navigate('/admin/formularios');
  };

  return (
    <CrudForm
      title={id ? 'Editar Formulario' : 'Crear Formulario'}
      initialValues={initialValues}
      iconClass="fas fa-file-alt"
      fields={[
        { name: 'titulo', label: 'Título', type: 'text' },
        { name: 'contenido', label: 'Contenido', type: 'textarea' },
      ]}
      onSubmit={handleSubmit}
    />
  );
}