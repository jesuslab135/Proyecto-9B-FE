import Table_emociones from '../../../components/admin/emociones_crud_components/Table_emociones';
import Top_emociones_crud from '../../../components/admin/emociones_crud_components/Top_emociones_crud';

const CRUD_emociones = () => {
  return (
    <>
      <div>
        <div>
          <Top_emociones_crud />
        </div>
        <div>
          <Table_emociones />
        </div>
      </div>
    </>
  );
};

export default CRUD_emociones;
