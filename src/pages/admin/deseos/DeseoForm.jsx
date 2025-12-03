import React, { useEffect, useState } from 'react';
import CrudForm from '../../../components/admin/CrudForm';
import { adminResourcesService } from '../../../services/AdminResourcesService';
import { useNavigate, useParams } from 'react-router-dom';

export default function DeseoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({ titulo: '', descripcion: '' });

  useEffect(() => {
    if (id) {
      adminResourcesService.getDeseo(id).then((res) => setInitialValues(res || {}));
    }
  }, [id]);

  const handleSubmit = async (values) => {
    if (id) {
      await adminResourcesService.updateDeseo(id, values);
    } else {
      await adminResourcesService.createDeseo(values);
    }
    navigate('/admin/deseos');
  };

  return (
    <CrudForm
      title={id ? 'Editar Deseo' : 'Crear Deseo'}
      initialValues={initialValues}
      iconClass="fas fa-star"
      fields={[
        { name: 'titulo', label: 'Título', type: 'text' },
        { name: 'descripcion', label: 'Descripción', type: 'textarea' },
      ]}
      onSubmit={handleSubmit}
    />
  );
}