import Table_deseos from '../../../components/admin/deseos_crud_components/Table_deseos';
import Top_deseos_crud from '../../../components/admin/deseos_crud_components/Top_deseos_crud';

const CRUD_deseos = () => {
  return (
    <>
      <div>
        <div>
          <Top_deseos_crud />
        </div>
        <div>
          <Table_deseos />
        </div>
      </div>
    </>
  );
};

export default CRUD_deseos;
