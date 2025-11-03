import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <>
            <footer className="footer-landing">
                <div className="container-landing">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3>Addictless</h3>
                            <p>Quit smoking—one smart nudge at a time.</p>
                            <div className="social-links">
                                <a href="#">
                                    <i className="fab fa-x-twitter"></i>
                                </a>
                                <a href="#">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="#">
                                    <i className="fab fa-linkedin"></i>
                                </a>
                            </div>
                        </div>

                        <div className="footer-section">
                            <h3>Quick Links</h3>
                            <ul style={{ listStyle: "none" }}>
                                <li>
                                    <a href="#home" style={{ color: "white", textDecoration: "none" }}>
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#features"
                                        style={{ color: "white", textDecoration: "none" }}
                                    >
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#how" style={{ color: "white", textDecoration: "none" }}>
                                        How It Works
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#contact"
                                        style={{ color: "white", textDecoration: "none" }}
                                    >
                                        Join Beta
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h3>Focus Areas</h3>
                            <ul style={{ listStyle: "none" }}>
                                <li>Craving Prediction</li>
                                <li>Heart-Rate Insights</li>
                                <li>Goal Coaching</li>
                                <li>Progress Tracking</li>
                            </ul>
                        </div>

                        <div style={{ borderTop: "1px solid #344956", paddingTop: "20px", marginTop: "30px" }}>
                            <p>&copy; 2025 Addictless. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;