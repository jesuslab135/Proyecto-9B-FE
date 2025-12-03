import Table_motivos from '../../../components/admin/motivos_crud_components/Table_motivos';
import Top_motivos_crud from '../../../components/admin/motivos_crud_components/Top_motivos_crud';

const CRUD_motivos = () => {
  return (
    <>
      <div>
        <div>
          <Top_motivos_crud />
        </div>
        <div>
          <Table_motivos />
        </div>
      </div>
    </>
  );
};

export default CRUD_motivos;
