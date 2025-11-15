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
          <div className="font-semibold">{item.texto ? item.texto.substring(0,60) : `Motivo #${item.id}`}</div>
          <div className="text-sm text-gray-600">Importancia: {item.importancia ?? 'N/A'}</div>
        </div>
      )}
    />
  );
}
