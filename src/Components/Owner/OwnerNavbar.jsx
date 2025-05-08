import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/Navbar.css"; // Import styles
import logo from "../../images/icon.png"; // Import the logo
import { getUserRole, isAuthenticated, getUserInfo } from "../../auth/JwtUtils";

const OwnerNavbar = () => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const userInfo = getUserInfo();
  const username = userInfo?.username || "User";  // Fallback to "User" if no username
  const role = getUserRole();

  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  // const handleChangePassword = () => {
  //   navigate("ownerChangePassword"); // Navigate to a change password page
  // };

  // const handleViewProfile = () => {
  //   navigate("/profile"); // Navigate to the profile page
  // };

  

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle the dropdown visibility
  };


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
        {/* <div className="nav-links">

          <Link to="/GameZoneOwner/dashboard" className="nav-item">Dashboard</Link>
        <Link to="/GameZoneOwner/add-games" className="nav-item">Add Games</Link>
        <Link to="/GameZoneOwner/add-game-category" className="nav-item">Add Game Category</Link>

          {loggedIn ? (
            <Link to="/login" className="nav-item login-btn" onClick={handleLogout}>LOGOUT</Link>
          ) : (
            <Link to="/login" className="nav-item login-btn">LOGIN</Link>
          )}
        </div> */}

        <div className="nav-links">
          {/* <Link to="/" className="nav-item">HOME</Link> */}


          {loggedIn ? (
            <>
              <Link to="/GameZoneOwner/dashboard" className="nav-item">Dashboard</Link>
              <Link to="/GameZoneOwner/add-games" className="nav-item">Add Games</Link>
              <Link to="/GameZoneOwner/add-game-category" className="nav-item">Add Game Category</Link>

              {/* User Dropdown */}
              <div className="user-dropdown">
                <button className="dropdown-btn" onClick={toggleDropdown}>
                  {username}
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    {/* Show specific options based on role */}
                    <Link to="/GameZoneOwner/ownerViewprofile" className="dropdown-item" >
                      View Profile
                    </Link>
                    <Link to="/GameZoneOwner/ownerChangePassword" className="dropdown-item" >
                      Change Password
                    </Link>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="nav-item login-btn">LOGIN</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default OwnerNavbar;
