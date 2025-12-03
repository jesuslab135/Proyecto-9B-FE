import Table_habitos from '../../../components/admin/habitos_crud_components/Table_habitos';
import Top_habitos_crud from '../../../components/admin/habitos_crud_components/Top_habitos_crud';

const CRUD_habitos = () => {
  return (
    <>
      <div>
        <div>
          <Top_habitos_crud />
        </div>
        <div>
          <Table_habitos />
        </div>
      </div>
    </>
  );
};

export default CRUD_habitos;
