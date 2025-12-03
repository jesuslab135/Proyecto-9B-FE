import React from 'react';
import CrudList from '../../../components/admin/CrudList';
import { adminResourcesService } from '../../../services/AdminResourcesService';

export default function DeseosList() {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Título', accessor: 'titulo' },
    { header: 'Descripción', accessor: 'descripcion', render: (item) => item.descripcion ? item.descripcion.substring(0, 50) + '...' : '' }
  ];

  return (
    <CrudList
      title="Administración de Deseos"
      subtitle="Gestiona los deseos de la plataforma"
      iconClass="fas fa-star"
      fetchList={() => adminResourcesService.listDeseos()}
      onDelete={(id) => adminResourcesService.deleteDeseo(id)}
      createPath="/admin/deseos/create"
      editPathPrefix="/admin/deseos/edit"
      columns={columns}
    />
  );
}