import React from 'react';
import CrudList from '../../../components/admin/CrudList';
import { adminResourcesService } from '../../../services/AdminResourcesService';

export default function MotivosList() {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Descripción', accessor: 'descripcion' }
  ];

  return (
    <CrudList
      title="Administración de Motivos"
      subtitle="Gestiona los motivos de la plataforma"
      iconClass="fas fa-comment-dots"
      fetchList={() => adminResourcesService.listMotivos()}
      onDelete={(id) => adminResourcesService.deleteMotivo(id)}
      createPath="/admin/motivos/create"
      editPathPrefix="/admin/motivos/edit"
      columns={columns}
    />
  );
}