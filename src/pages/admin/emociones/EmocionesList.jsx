import React from 'react';
import CrudList from '../../../components/admin/CrudList';
import { adminResourcesService } from '../../../services/AdminResourcesService';

export default function EmocionesList() {
  return (
    <CrudList
      resourceName="Emociones"
      fetchList={() => adminResourcesService.listEmociones()}
      onDelete={(id) => adminResourcesService.deleteEmocion(id)}
      createPath="/admin/emociones/create"
      editPathPrefix="/admin/emociones/edit"
      renderItem={(item) => (
        <div>
          <div className="font-semibold">{item.nombre || `Emoción #${item.id}`}</div>
          <div className="text-sm text-gray-600">Intensidad: {item.intensidad ?? 'N/A'}</div>
        </div>
      )}
    />
  );
}
import React from 'react';
import CrudList from '../../../components/admin/CrudList';
import { adminResourcesService } from '../../../services/AdminResourcesService';

export default function EmocionesList() {
  return (
    <CrudList
      resourceName="Emociones"
      fetchList={() => adminResourcesService.listEmociones()}
      onDelete={(id) => adminResourcesService.deleteEmocion(id)}
      createPath="/admin/emociones/create"
      editPathPrefix="/admin/emociones/edit"
      renderItem={(item) => (
        <div>
          <div className="font-semibold">{item.nombre || `Emoción #${item.id}`}</div>
          <div className="text-sm text-gray-600">Intensidad: {item.intensidad ?? 'N/A'}</div>
        </div>
      )}
    />
  );
}
