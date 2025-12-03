import React from 'react';
import CrudList from '../../../components/admin/CrudList';
import { adminResourcesService } from '../../../services/AdminResourcesService';

export default function HabitosList() {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Título', accessor: 'titulo' },
    { header: 'Frecuencia', accessor: 'frecuencia' }
  ];

  return (
    <CrudList
      title="Administración de Hábitos"
      subtitle="Gestiona los hábitos de la plataforma"
      iconClass="fas fa-calendar-check"
      fetchList={() => adminResourcesService.listHabitos()}
      onDelete={(id) => adminResourcesService.deleteHabito(id)}
      createPath="/admin/habitos/create"
      editPathPrefix="/admin/habitos/edit"
      columns={columns}
    />
  );
}
