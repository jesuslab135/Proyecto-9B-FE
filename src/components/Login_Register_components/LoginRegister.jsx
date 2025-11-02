import { useEffect } from "react";
import { loginRegisterScript } from "../../utils/login-register/script.js";
import { Link } from "react-router-dom";
import "../../styles/login-register/style.css";

const LoginRegister = () => {
  useEffect(() => {
    loginRegisterScript();
  }, []);

    return (
    <>
        <div className="body-login-register">
            <div className="container-login-register">
                <div className="back-arr-btn">
                    <Link to="/"><i className='bx bx-chevron-left'></i></Link>
                </div>
                <div className="form-box login">
                    <form className="form-pro" action="">
                        <h1 className="login-h1">Login</h1>
                        <div className="input-box">
                            <input type="text" placeholder="Username" required />
                            <i className='bx bxs-user' ></i> 
                        </div>
                        <div className="input-box">
                            <input type="password" placeholder="Password" required />
                            <i className='bx bxs-lock-alt' ></i> 
                        </div>
                        <div className="forgot-link">
                            <a href="#">Forgot password</a>
                        </div>
                        <button type="submit" className="btn">Login</button>
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
                    <form action="">
                        <h1>Registration</h1>
                        <div className="input-box">
                            <input type="text" placeholder="Username" required />
                            <i className='bx bxs-user' ></i> 
                        </div>
                        <div className="input-box">
                            <input type="email" placeholder="Email" required />
                            <i className='bx bxs-envelope'></i>
                        </div>
                        <div className="input-box">
                            <input type="password" placeholder="Password" required />
                            <i className='bx bxs-lock-alt' ></i>
                        </div>
                        <button type="submit" className="btn">Register</button>
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
                        <button className="btn register-btn">Register</button>
                    </div>
                    <div className="toggle-panel toggle-right">
                        <h1>Welcome Back!</h1>
                        <p>Already have an account?</p>
                        <button className="btn login-btn">Login</button>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
};



export default LoginRegister;