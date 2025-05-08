import React from "react";
import "../css/Home.css";
import { Link } from "react-router-dom";
import homeImg from "../images/home.jpg";
import ResetPassword from "./ResetPassword";
import Navbar from "./Navbar";

const Home = () => {
  return (
    <>
    <Navbar/>
    <div className="game-home-container">
      {/* Hero Section with Background */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="legend-text">LEGEND</span><br />
            <span className="never-text">NEVER</span><br />
            <span className="giveup-text">GIVE-UP</span>
          </h1>
        </div>
        <div className="hero-image-container">
          {/* Character image will be added via CSS */}
        </div>
      </div>


      
      {/* Footer */}
      <footer className="game-footer">
        <div className="footer-content">
          <p>© 2023 Game Zone | All Rights Reserved</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Home;
