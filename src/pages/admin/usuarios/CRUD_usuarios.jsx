import Table_users from '../../../components/admin/usuarios_crud_components/Table_users';
import Top_usuarios_crud from '../../../components/admin/usuarios_crud_components/Top_usuarios_crud';

const CRUD_usuarios = () => {
  return (
    <>
    <div >
      <div>
        <Top_usuarios_crud />
      </div>
      <div>
        <Table_users />
      </div>
    </div>
      
    </>
  );
};

export default CRUD_usuarios;
