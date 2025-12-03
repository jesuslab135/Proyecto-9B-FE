import React from 'react';
import CrudList from '../../../components/admin/CrudList';
import { adminResourcesService } from '../../../services/AdminResourcesService';

export default function EmocionesList() {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Intensidad', accessor: 'intensidad' }
  ];

  return (
    <CrudList
      title="Administración de Emociones"
      subtitle="Gestiona las emociones de la plataforma"
      iconClass="fas fa-heart"
      fetchList={() => adminResourcesService.listEmociones()}
      onDelete={(id) => adminResourcesService.deleteEmocion(id)}
      createPath="/admin/emociones/create"
      editPathPrefix="/admin/emociones/edit"
      columns={columns}
    />
  );
}