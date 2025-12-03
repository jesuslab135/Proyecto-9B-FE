import Create_content from "../../../components/admin/usuarios_crud_components/Create_content";
import Top_usuarios_crud from "../../../components/admin/usuarios_crud_components/Top_usuarios_crud";

const Create_usuario = () => {
  return (
    <>
      <div>
        <Top_usuarios_crud />
      </div>
      <div>
        <Create_content />
      </div>
    </>
  );
};

export default Create_usuario;
