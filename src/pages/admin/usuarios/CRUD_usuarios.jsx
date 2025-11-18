import Search_bar from '../../../components/admin/usuarios_crud_components/Search_bar';
import Top_usuarios_crud from '../../../components/admin/usuarios_crud_components/Top_usuarios_crud';

const CRUD_usuarios = () => {
  return (
    <>
      <div className=''>
        <Top_usuarios_crud />
      </div>
      <div >
        <Search_bar />
      </div>
    </>
  );
};

export default CRUD_usuarios;
