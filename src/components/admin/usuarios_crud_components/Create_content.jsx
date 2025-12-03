import "./Create_content.css";
import { useState } from "react";
import { UsuariosAPI } from "../../../utils/api/usuarios.client";
import { useNavigate } from "react-router-dom";

const Create_content = () => {

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        rol: '',
        password: ''
    });

    const [isCreateSuccessful, setIsCreateSuccessful] = useState(false);

    const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
};

const navigate = useNavigate();

    const createUsuario = async () => {
    try {
        const response = await UsuariosAPI.create(formData);
        console.log("Usuario creado:", response);
        // console.log(formData);
        setIsCreateSuccessful(true);

        setTimeout(() => {
            navigate('/admin/usuarios');
        }, 3000);
    } catch (error) {
        console.error("Error al crear usuario:", error);
    }
};

const cancelFunction = () => {
    setFormData(null);
    navigate("/admin/usuarios");
}
    return (
        <>
        <div className="body-create-usuario">
            <h2>Crear nuevo usuario</h2>
            {isCreateSuccessful === true ? (
                <>
                <section>
                    Usuario creado correctamente!!!
                </section>
                </>
            ): null}
            <form className="form-create-usuario">
                <div className="form-group">
                    <label htmlFor="nombre">Nombre Completo:</label>
                    <input type="text" id="nombre" name="nombre" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Correo Electrónico:</label>
                    <input type="email" id="email" name="email" onChange={handleChange} required />
                </div>  
                <div className="form-group">
                    <label htmlFor="telefono">Teléfono:</label>
                    <input type="tel" id="telefono" name="telefono" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="rol">Rol:</label>
                    <select id="rol" name="rol" onChange={handleChange} required>
                        <option value="">Seleccione un rol</option>
                        <option value="administrador">Administrador</option>
                        <option value="consumidor">Usuario</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input type="password" id="password" name="password" onChange={handleChange} required />
                </div>
                <button onClick={createUsuario} type="button" className="btn-create-usuario">Crear Usuario</button>
                <button onClick={cancelFunction} type="button" className="btn-cancelar">Cancelar</button>
            </form>

        </div>
        </>
    )
}

export default Create_content;