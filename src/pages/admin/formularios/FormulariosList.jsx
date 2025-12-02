import React from 'react';
import CrudList from '../../../components/admin/CrudList';
import { adminResourcesService } from '../../../services/AdminResourcesService';

export default function FormulariosList() {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Título', accessor: 'titulo' },
    { header: 'Contenido', accessor: 'contenido', render: (item) => item.contenido ? item.contenido.substring(0, 50) + '...' : '' }
  ];

  return (
    <CrudList
      title="Administración de Formularios"
      subtitle="Gestiona los formularios de la plataforma"
      iconClass="fas fa-file-alt"
      fetchList={() => adminResourcesService.listFormularios()}
      onDelete={(id) => adminResourcesService.deleteFormulario(id)}
      createPath="/admin/formularios/create"
      editPathPrefix="/admin/formularios/edit"
      columns={columns}
    />
  );
}