import Table_formularios from '../../../components/admin/formularios_crud_components/Table_formularios';
import Top_formularios_crud from '../../../components/admin/formularios_crud_components/Top_formularios_crud';

const CRUD_formularios = () => {
  return (
    <>
      <div>
        <div>
          <Top_formularios_crud />
        </div>
        <div>
          <Table_formularios />
        </div>
      </div>
    </>
  );
};

export default CRUD_formularios;
