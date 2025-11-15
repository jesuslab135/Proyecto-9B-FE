import React from 'react';
import CrudList from '../../../components/admin/CrudList';
import { adminResourcesService } from '../../../services/AdminResourcesService';

export default function DeseosList() {
  return (
    <CrudList
      resourceName="Deseos"
      fetchList={() => adminResourcesService.listDeseos()}
      onDelete={(id) => adminResourcesService.deleteDeseo(id)}
      createPath="/admin/deseos/create"
      editPathPrefix="/admin/deseos/edit"
      renderItem={(item) => (
        <div>
          <div className="font-semibold">{item.titulo || `Deseo #${item.id}`}</div>
          <div className="text-sm text-gray-600">{item.descripcion ? item.descripcion.substring(0,120) : ''}</div>
        </div>
      )}
    />
  );
}