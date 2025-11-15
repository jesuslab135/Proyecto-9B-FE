import React from 'react';
import CrudList from '../../../components/admin/CrudList';
import { adminResourcesService } from '../../../services/AdminResourcesService';

export default function HabitosList() {
  return (
    <CrudList
      resourceName="Hábitos"
      fetchList={() => adminResourcesService.listHabitos()}
      onDelete={(id) => adminResourcesService.deleteHabito(id)}
      createPath="/admin/habitos/create"
      editPathPrefix="/admin/habitos/edit"
      renderItem={(item) => (
        <div>
          <div className="font-semibold">{item.titulo || `Hábito #${item.id}`}</div>
          <div className="text-sm text-gray-600">Frecuencia: {item.frecuencia ?? 'N/A'}</div>
        </div>
      )}
    />
  );
}
import React from 'react';
import CrudList from '../../../components/admin/CrudList';
import { adminResourcesService } from '../../../services/AdminResourcesService';

export default function HabitosList() {
  return (
    <CrudList
      resourceName="Hábitos"
      fetchList={() => adminResourcesService.listHabitos()}
      onDelete={(id) => adminResourcesService.deleteHabito(id)}
      createPath="/admin/habitos/create"
      editPathPrefix="/admin/habitos/edit"
      renderItem={(item) => (
        <div>
          <div className="font-semibold">{item.nombre || `Hábito #${item.id}`}</div>
          <div className="text-sm text-gray-600">Frecuencia: {item.frecuencia || 'N/A'}</div>
        </div>
      )}
    />
  );
}
