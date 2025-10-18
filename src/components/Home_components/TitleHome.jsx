import "../../styles/Home/style.css";
import { homeScript } from "../../utils/Home/script.js";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const TitleHome = () => {
  useEffect(() => {
    homeScript();
  }, []);

  return (
    <>
    <div className="body">
      <header className="header-landing">
        <nav className="container-landing">
          <div className="logo">Addictless</div>
          <ul className="nav-links active">
            <li>
              <a href="#home">Home</a>
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

      <section className="hero" id="home">
        <div className="hero-content">
          <h1>Quit Smoking—Backed by Your Wrist</h1>
          <p>
            Addictless pairs with your smartwatch to track heart rate, log every
            cigarette, and coach you with personalized goals. Predictive nudges
            help you beat cravings before they hit.
          </p>
          <a href="#contact" className="cta-button">
            Join the Free Beta
          </a>
        </div>
      </section>

      <section className="services" id="features">
        <div className="container-landing">
          <div className="section-header">
            <h2>Features</h2>
            <p>
              Everything you need to build momentum, reduce cigarettes, and stay
              smoke-free.
            </p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-heart-pulse"></i>
              </div>
              <h3>BPM & Stress Tracking</h3>
              <p>
                Continuous heart-rate insights reveal stress spikes and moments
                you’re most vulnerable to cravings.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-smoking"></i>
              </div>
              <h3>1-Tap Cigarette Log</h3>
              <p>
                Log each cigarette from your watch—see daily trends, triggers,
                and progress at a glance.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-bullseye"></i>
              </div>
              <h3>Adaptive Goals</h3>
              <p>
                Personalized reduction plans that adjust to your data, from
                cut-downs to a full quit date.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-bell"></i>
              </div>
              <h3>Predictive Nudges</h3>
              <p>
                Smart notifications when your patterns suggest a craving
                window—before you light up.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Insights & Trends</h3>
              <p>
                See BPM vs. cigarettes, peak craving hours, and weekly wins to
                keep motivation high.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-shield-heart"></i>
              </div>
              <h3>Supportive Coaching</h3>
              <p>
                Micro-suggestions and coping tips tailored to your progress—no
                judgment, just help.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="portfolio" id="how">
        <div className="container-landing">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Three simple steps to start reducing today.</p>
          </div>

          <div className="portfolio-filters">
            <button className="filter-btn active" data-filter="all">
              All
            </button>
            <button className="filter-btn" data-filter="track">
              Track
            </button>
            <button className="filter-btn" data-filter="coach">
              Coach
            </button>
            <button className="filter-btn" data-filter="progress">
              Progress
            </button>
          </div>

          <div className="portfolio-grid">
            <div className="portfolio-item" data-category="track">
              <img
                src="https://images.unsplash.com/photo-1515734674582-29010bb37906?q=80&w=1200&auto=format&fit=crop"
                alt="Smartwatch tracking heart rate"
              />
              <div className="portfolio-overlay">
                <h3>Pair Your Watch</h3>
                <p>
                  Sync heart rate and start 1-tap cigarette logging from your
                  wrist.
                </p>
              </div>
            </div>

            <div className="portfolio-item" data-category="coach">
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop"
                alt="Coaching suggestions on a phone screen"
              />
              <div className="portfolio-overlay">
                <h3>Predictive Coaching</h3>
                <p>
                  Receive timely tips and nudges when your data suggests a
                  craving.
                </p>
              </div>
            </div>

            <div className="portfolio-item" data-category="progress">
              <img
                src="https://images.unsplash.com/photo-1519834785169-98be25ec3f84?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764"
                alt="Progress charts showing reduction"
              />
              <div className="portfolio-overlay">
                <h3>See Your Wins</h3>
                <p>
                  Watch cigarettes/day trend down and BPM stabilize over time.
                </p>
              </div>
            </div>

            <div className="portfolio-item" data-category="track">
              <img
                src="https://www.garminnews.com/wp-content/uploads/2025/09/lifestyle-1-996x1024.webp"
                alt="User logging a cigarette on smartwatch"
              />
              <div className="portfolio-overlay">
                <h3>Log Without Friction</h3>
                <p>Logging takes a second, so you never break flow.</p>
              </div>
            </div>

            <div className="portfolio-item" data-category="coach">
              <img
                src="https://www.speexx.com/wp-content/uploads/Speexx_Blog_Goal_Setting.jpg"
                alt="Goal setting screen"
              />
              <div className="portfolio-overlay">
                <h3>Set a Quit Plan</h3>
                <p>Choose a target date or a gradual plan—Addictless adapts.</p>
              </div>
            </div>

            <div className="portfolio-item" data-category="progress">
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop"
                alt="Celebratory milestone badge"
              />
              <div className="portfolio-overlay">
                <h3>Celebrate Milestones</h3>
                <p>Streaks, badges, and weekly summaries keep you motivated.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials" id="testimonials">
        <div className="container-landing">
          <div className="section-header">
            <h2>Success Stories</h2>
            <p>Real people, real reductions—on the path to smoke-free.</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="testimonial-text">
                “The nudges hit right when I usually light up. Down from 18 to
                6/day in 3 weeks.”
              </p>
              <div className="testimonial-author">Andrea M.</div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-rating">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="testimonial-text">
                “Seeing my BPM calm as I cut down was the proof I needed to keep
                going.”
              </p>
              <div className="testimonial-author">Luis R.</div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-rating">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="testimonial-text">
                “I set a quit date and actually hit it. The watch logging made
                it effortless.”
              </p>
              <div className="testimonial-author">Samira K.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="container-landing">
          <div className="section-header">
            <h2>Join the Addictless Beta</h2>
            <p>
              Tell us a bit about you and we’ll send an invite if you’re a fit.
            </p>
          </div>
          <div className="contact-content">
            <div className="contact-info">
              <h3>About the Beta</h3>
              <div className="contact-item">
                <i className="fas fa-shield"></i>
                <div>
                  <h4>Privacy First</h4>
                  <p>
                    Your health data stays encrypted. You control what’s shared.
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <i className="fas fa-mobile-screen"></i>
                <div>
                  <h4>Compatible Devices</h4>
                  <p>
                    Apple Watch, WearOS (Pixel, Galaxy), Fitbit (Sense/Versa).
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h4>Contact</h4>
                  <p>team@addictless.app</p>
                </div>
              </div>

              <div className="contact-item">
                <i className="fas fa-clock"></i>
                <div>
                  <h4>Beta Cohorts</h4>
                  <p>Rolling invites—new cohort every 2 weeks.</p>
                </div>
              </div>
            </div>

            <div className="booking-form">
              <h3>For Questions</h3>
              <form autoComplete="off">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" name="name" id="name" required />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" name="email" id="email" required />
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country/Region</label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    placeholder="e.g., Mexico"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="watch">Smartwatch</label>
                  <select name="watch" id="watch" required>
                    <option value="">Select Device</option>
                    <option value="apple">Apple Watch</option>
                    <option value="wearos">WearOS (Pixel/Galaxy)</option>
                    <option value="fitbit">Fitbit Sense/Versa</option>
                    <option value="other">Other/None</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Anything we should know?</label>
                  <textarea
                    name="message"
                    id="message"
                    placeholder="Triggers, past attempts, or preferences..."
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

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
              <ul style={{listStyle: "none"}}>
                <li>
                  <a href="#home" style={{color: "white", textDecoration: "none"}}>
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    style={{color: "white", textDecoration: "none"}}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how" style={{color: "white", textDecoration: "none"}}>
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    style={{color: "white", textDecoration: "none"}}
                  >
                    Join Beta
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>Focus Areas</h3>
              <ul style={{listStyle: "none"}}>
                <li>Craving Prediction</li>
                <li>Heart-Rate Insights</li>
                <li>Goal Coaching</li>
                <li>Progress Tracking</li>
              </ul>
            </div>

            <div style={{borderTop: "1px solid #344956", paddingTop: "20px", marginTop: "30px"}}>
              <p>&copy; 2025 Addictless. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
};

export default TitleHome;
