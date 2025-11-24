import { useEffect, useState } from "react";
import { loginRegisterScript } from "../../utils/login-register/script.js";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/AuthService.js";
import { logger } from "../../services/Logger.js";
import "../../styles/login-register/style.css";

const LoginRegister = () => {
  const navigate = useNavigate();


  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });


  const [registerData, setRegisterData] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loginRegisterScript();


    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser();
      const redirectPath = user?.rol === 'administrador' ? '/admin/dashboard' : '/dashboard';
      navigate(redirectPath);
    }
  }, [navigate]);


  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(""); 
  };


  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(""); 
  };


  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");


    if (!loginData.email || !loginData.password) {
      setError("Por favor complete todos los campos");
      return;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      setError("Por favor ingrese un email válido");
      return;
    }

    setIsLoading(true);

    try {
      logger.info('LoginRegister: Attempting login', { email: loginData.email });

      const result = await authService.login(loginData.email, loginData.password);

      if (result.success) {
        setSuccess("¡Inicio de sesión exitoso!");
        logger.info('LoginRegister: Login successful, redirecting');


        setTimeout(() => {
          navigate(result.redirectTo);
        }, 500);
      } else {
        setError(result.error || "Error al iniciar sesión");
        logger.warn('LoginRegister: Login failed', { error: result.error });
      }
    } catch (error) {
      setError("Error de conexión. Por favor intente nuevamente.");
      logger.error('LoginRegister: Login error', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");


    if (!registerData.nombre || !registerData.email || !registerData.password) {
      setError("Por favor complete todos los campos obligatorios");
      return;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setError("Por favor ingrese un email válido");
      return;
    }


    if (registerData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      logger.info('LoginRegister: Attempting registration', { email: registerData.email });

      const result = await authService.register(registerData);

      if (result.success) {
        setSuccess("¡Registro exitoso! Redirigiendo...");
        logger.info('LoginRegister: Registration successful');


        setTimeout(() => {
          navigate('/onboarding/physical-data');
        }, 1000);
      } else {
        setError(result.error || "Error al registrar usuario");
        logger.warn('LoginRegister: Registration failed', { error: result.error });
      }
    } catch (error) {
      setError("Error de conexión. Por favor intente nuevamente.");
      logger.error('LoginRegister: Registration error', error);
    } finally {
      setIsLoading(false);
    }
  };

    return (
    <>
        <div className="body-login-register">
            <div className="container-login-register">
                <div className="back-arr-btn">
                    <Link to="/"><i className='bx bx-chevron-left'></i></Link>
                </div>


                {error && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    left: '20px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    zIndex: 1000,
                    textAlign: 'center',
                    fontSize: '14px',
                  }}>
                    {error}
                  </div>
                )}

                {success && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    left: '20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    zIndex: 1000,
                    textAlign: 'center',
                    fontSize: '14px',
                  }}>
                    {success}
                  </div>
                )}


                <div className="form-box login">
                    <form className="form-pro" onSubmit={handleLoginSubmit}>
                        <h1 className="login-h1">Login</h1>
                        <div className="input-box">
                            <input 
                              type="email" 
                              name="email"
                              placeholder="Email" 
                              value={loginData.email}
                              onChange={handleLoginChange}
                              disabled={isLoading}
                              required 
                            />
                            <i className='bx bxs-envelope'></i> 
                        </div>
                        <div className="input-box">
                            <input 
                              type="password" 
                              name="password"
                              placeholder="Password" 
                              value={loginData.password}
                              onChange={handleLoginChange}
                              disabled={isLoading}
                              required 
                            />
                            <i className='bx bxs-lock-alt'></i> 
                        </div>
                        <div className="forgot-link">
                            <a href="#">Forgot password?</a>
                        </div>
                        <button 
                          type="submit" 
                          className="btn"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Cargando...' : 'Login'}
                        </button>
                        <p>or login with social platforms</p>
                        <div className="social-icons">
                            <a href="#"><i className='bx bxl-google'></i></a>
                            <a href="#"><i className='bx bxl-facebook-circle'></i></a>
                            <a href="#"><i className='bx bxl-github' ></i></a>
                            <a href="#"><i className='bx bxl-linkedin' ></i></a>
                        </div>
                    </form>
                </div>

 
                <div className="form-box register">
                    <form onSubmit={handleRegisterSubmit}>
                        <h1>Registration</h1>
                        <div className="input-box">
                            <input 
                              type="text" 
                              name="nombre"
                              placeholder="Nombre Completo" 
                              value={registerData.nombre}
                              onChange={handleRegisterChange}
                              disabled={isLoading}
                              required 
                            />
                            <i className='bx bxs-user' ></i> 
                        </div>
                        <div className="input-box">
                            <input 
                            id="email-register"
                              type="email" 
                              name="email"
                              placeholder="Email" 
                              value={registerData.email}
                              onChange={handleRegisterChange}
                              disabled={isLoading}
                              required 
                            />
                            <i className='bx bxs-envelope'></i>
                        </div>
                        <div className="input-box">
                            <input 
                            id="tel-register"
                              type="tel" 
                              name="telefono"
                              placeholder="Teléfono" 
                              value={registerData.telefono}
                              onChange={handleRegisterChange}
                              disabled={isLoading}
                            />
                            <i className='bx bxs-phone'></i>
                        </div>
                        <div className="input-box">
                            <input 
                              id="password-register"
                              type="password" 
                              name="password"
                              placeholder="Password" 
                              value={registerData.password}
                              onChange={handleRegisterChange}
                              disabled={isLoading}
                              required 
                            />
                            <i className='bx bxs-lock-alt' ></i>
                        </div>
                        <button 
                          type="submit" 
                          className="btn"
                          disabled={isLoading}
                          id="register-submit"
                        >
                          {isLoading ? 'Cargando...' : 'Register'}
                        </button>
                        <p>or register with social platforms</p>
                        <div className="social-icons">
                            <a href="#"><i className='bx bxl-google'></i></a>
                            <a href="#"><i className='bx bxl-facebook-circle'></i></a>
                            <a href="#"><i className='bx bxl-github' ></i></a>
                            <a href="#"><i className='bx bxl-linkedin' ></i></a>
                        </div>
                    </form>
                </div>

    
                <div className="toggle-box">
                    <div className="toggle-panel toggle-left">
                        <h1>Hello, Welcome!</h1>
                        <p>Don't have an account?</p>
                        <button id="register-button" className="btn register-btn" disabled={isLoading}>Register</button>
                    </div>
                    <div className="toggle-panel toggle-right">
                        <h1>Welcome Back!</h1>
                        <p>Already have an account?</p>
                        <button className="btn login-btn" disabled={isLoading}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
};



export default LoginRegister;