import React from 'react';
import CrudList from '../../../components/admin/CrudList';
import { adminResourcesService } from '../../../services/AdminResourcesService';

export default function FormulariosList() {
  return (
    <CrudList
      resourceName="Formularios"
      fetchList={() => adminResourcesService.listFormularios()}
      onDelete={(id) => adminResourcesService.deleteFormulario(id)}
      createPath="/admin/formularios/create"
      editPathPrefix="/admin/formularios/edit"
      renderItem={(item) => (
        <div>
          <div className="font-semibold">{item.titulo || `Formulario #${item.id}`}</div>
          <div className="text-sm text-gray-600">{item.contenido ? item.contenido.substring(0,120) : ''}</div>
        </div>
      )}
    />
  );
}
import React from 'react';
import CrudList from '../../../components/admin/CrudList';
import { adminResourcesService } from '../../../services/AdminResourcesService';

export default function FormulariosList() {
  return (
    <CrudList
      resourceName="Formularios"
      fetchList={() => adminResourcesService.listFormularios()}
      onDelete={(id) => adminResourcesService.deleteFormulario(id)}
      createPath="/admin/formularios/create"
      editPathPrefix="/admin/formularios/edit"
      renderItem={(item) => (
        <div>
          <div className="font-semibold">{item.titulo || `Formulario #${item.id}`}</div>
          <div className="text-sm text-gray-600">{item.contenido ? item.contenido.substring(0,120) : ''}</div>
        </div>
      )}
    />
  );
}
