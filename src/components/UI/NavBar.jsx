import "./NavBar.css";
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <>
            <header className="header-landing">
                <nav className="container-landing">
                    <div className="logo">Addictless</div>
                    <ul className="nav-links active">
                        <li>
                            <Link to="/" replace>
                                <a href="#home">Home</a>
                            </Link>
                        </li>
                        <li>
                            <a href="#features">Features</a>
                        </li>
                        <li>
                            <a href="#how">How It Works</a>
                        </li>
                        <li>
                            <a href="#testimonials">Stories</a>
                        </li>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                    </ul>
                    <button className="menu-toggle">
                        <i className="fas fa-bars" id="hamburguer"></i>
                    </button>
                </nav>
            </header>
        </>
    )
}

export default NavBar;