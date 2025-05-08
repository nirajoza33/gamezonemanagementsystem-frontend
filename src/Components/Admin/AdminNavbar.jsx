import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/Navbar.css"; // Import styles
import logo from "../../images/icon.png"; // Import the logo
import { getUserRole, isAuthenticated } from "../../auth/JwtUtils";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const role = getUserRole();

  return (
    <nav className="game-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Game Zone Logo" className="logo-img" />
          <span className="logo-text">
            <span className="game-text">GAME</span>
            <span className="zone-text">ZONE</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          {/* <Link to="/" className="nav-item">HOME</Link> */}
          {/* <Link to="/add-games" className="nav-item">Add Games</Link> */}
          {/* <Link to="/login" className="nav-item login-btn">LOGIN</Link> */}

          <Link to="/Admin/dashboard" className="nav-item">Dashboard</Link>
        {/* <Link to="/GameZoneOwner/add-games" className="nav-item">Add Games</Link>
        <Link to="/GameZoneOwner/add-game-category" className="nav-item">Add Game Category</Link> */}

          {loggedIn ? (
            <Link to="/login" className="nav-item login-btn" onClick={handleLogout}>LOGOUT</Link>
          ) : (
            <Link to="/login" className="nav-item login-btn">LOGIN</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
