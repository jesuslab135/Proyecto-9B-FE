import React from 'react';
import CrudList from '../../../components/admin/CrudList';
import { adminResourcesService } from '../../../services/AdminResourcesService';

export default function MotivosList() {
  return (
    <CrudList
      resourceName="Motivos"
      fetchList={() => adminResourcesService.listMotivos()}
      onDelete={(id) => adminResourcesService.deleteMotivo(id)}
      createPath="/admin/motivos/create"
      editPathPrefix="/admin/motivos/edit"
      renderItem={(item) => (
        <div>
          <div className="font-semibold">{item.descripcion || `Motivo #${item.id}`}</div>
        </div>
      )}
    />
  );
}