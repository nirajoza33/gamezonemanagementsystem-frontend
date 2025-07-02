"use client"
import "../css/Footer.css"
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa"
import { HiLocationMarker, HiMail, HiPhone } from "react-icons/hi"

const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}

const Footer = () => {
  return (
    <footer className="footer">
      {/* Animated background elements */}
      <div className="footer-bg-elements">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="footer-container">
        {/* Left Section: Logo + Description + Socials */}
        <section className="footer-section footer-left">
          <div className="logo-container">
            <div className="logo-text">
              <span className="logo-hu">PL</span>
              <span className="logo-la">AY</span>
              <span className="logo-bo">VANA</span>
            </div>
            <div className="logo-tagline">Fun Beyond Imagination</div>
          </div>
          
          <p className="footer-description">
            Your ultimate fun destination awaits! Unleash the excitement with games and adventures beyond your
            imagination. Come join the fun and explore with us
          </p>

          {/* Contact Info */}
          <div className="contact-info">
            <div className="contact-item">
              <HiLocationMarker className="contact-icon" />
              <span>Y Junction, Dumas Road, Surat</span>
            </div>
            <div className="contact-item">
              <HiPhone className="contact-icon" />
              <span>+91 98765 43210</span>
            </div>
            <div className="contact-item">
              <HiMail className="contact-icon" />
              <span>hello@Playvana.com</span>
            </div>
          </div>
          
          <div className="social-section">
            <h4 className="social-title">Follow Us</h4>
            <div className="social-icons" aria-label="Social media links">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="social-link facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social-link instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="social-link youtube"
              >
                <FaYoutube />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="social-link linkedin"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </section>

        {/* Center Section: Quick Links */}
        <nav className="footer-section footer-center" aria-label="Quick links">
          <h3 className="footer-title">
            <span className="title-icon">🔗</span>
            Quick Links
          </h3>
          <ul className="footer-links">
            {[
              { name: "Home", href: "home", icon: "🏠" },
              { name: "About Us", href: "about", icon: "👥" },
              // { name: "Contact", href: "contact", icon: "📞" },
              { name: "Games", href: "/games", icon: "🎮" },
              
            ].map(({ name, href, icon }) => (
              <li key={name}>
                <button className="footer-link" onClick={() => scrollToSection(href)} aria-label={`Scroll to ${name}`}>
                  <span className="link-icon">{icon}</span>
                  <span className="link-text">{name}</span>
                  <span className="link-arrow">→</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Newsletter Signup */}
          <div className="newsletter-section">
            <h4 className="newsletter-title">Stay Updated</h4>
            <p className="newsletter-desc">Get the latest news and offers</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button className="newsletter-btn">
                <span>Subscribe</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Right Section: Location & Map */}
        <section className="footer-section footer-right" aria-label="Location map">
          <h3 className="footer-title">
            <span className="title-icon">📍</span>
            Find Us
          </h3>
          
          <div className="map-container">
            <iframe
              title="Google Map Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3722.309361314106!2d72.78993601533227!3d21.104570385980095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f8cb0cdcf61%3A0xc53e48b528d62064!2sY%20Junction%20Dumas%20Road%20BRTS!5e0!3m2!1sen!2sin!4v1653462222295!5m2!1sen!2sin"
              width="100%"
              height="200"
              style={{ border: 0, borderRadius: "16px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="map-overlay">
              <div className="location-badge">
                <HiLocationMarker />
                <span>We're Here!</span>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="hours-section">
            <h4 className="hours-title">Operating Hours</h4>
            <div className="hours-list">
              <div className="hours-item">
                <span className="day">Mon - Fri</span>
                <span className="time">10:00 AM - 11:00 PM</span>
              </div>
              <div className="hours-item">
                <span className="day">Sat - Sun</span>
                <span className="time">9:00 AM - 12:00 AM</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="copyright">
            <span>©2024 Playvana. All Rights Reserved.</span>
          </div>
          <div className="footer-bottom-links">
            <a href="/terms" className="bottom-link">Terms</a>
            <a href="/privacy" className="bottom-link">Privacy</a>
            <a href="/cookies" className="bottom-link">Cookies</a>
          </div>
          <div className="made-with">
            <span>Made with ❤️ for Fun</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
