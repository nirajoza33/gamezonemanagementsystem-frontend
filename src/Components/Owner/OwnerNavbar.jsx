// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./OwnerNavbar.css"; // Import styles
// import logo from "../../images/icon.png"; // Import the logo
// import { getUserRole, isAuthenticated, getUserInfo } from "../../auth/JwtUtils";

// const OwnerNavbar = () => {
//   const navigate = useNavigate();
//   const loggedIn = isAuthenticated();
//   const userInfo = getUserInfo();
//   const username = userInfo?.username || "User";  // Fallback to "User" if no username
//   const role = getUserRole();

//   const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility

//   const handleLogout = () => {
//     sessionStorage.clear();
//     navigate("/login");
//   };

//   // const handleChangePassword = () => {
//   //   navigate("ownerChangePassword"); // Navigate to a change password page
//   // };

//   // const handleViewProfile = () => {
//   //   navigate("/profile"); // Navigate to the profile page
//   // };

  

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen); // Toggle the dropdown visibility
//   };


//   return (
//     <nav className="game-navbar">
//       <div className="navbar-container">
//         {/* Logo */}
//         <Link to="/" className="navbar-logo">
//           <img src={logo} alt="Game Zone Logo" className="logo-img" />
//           <span className="logo-text">
//             <span className="game-text">GAME</span>
//             <span className="zone-text">ZONE</span>
//           </span>
//         </Link>

//         {/* Navigation Links */}
//         {/* <div className="nav-links">

//           <Link to="/GameZoneOwner/dashboard" className="nav-item">Dashboard</Link>
//         <Link to="/GameZoneOwner/add-games" className="nav-item">Add Games</Link>
//         <Link to="/GameZoneOwner/add-game-category" className="nav-item">Add Game Category</Link>

//           {loggedIn ? (
//             <Link to="/login" className="nav-item login-btn" onClick={handleLogout}>LOGOUT</Link>
//           ) : (
//             <Link to="/login" className="nav-item login-btn">LOGIN</Link>
//           )}
//         </div> */}

//         <div className="nav-links">
//           {/* <Link to="/" className="nav-item">HOME</Link> */}


//           {loggedIn ? (
//             <>
//               <Link to="/GameZoneOwner/dashboard" className="nav-item">Dashboard</Link>
//               <Link to="/GameZoneOwner/add-games" className="nav-item">Add Games</Link>
//               <Link to="/GameZoneOwner/add-game-category" className="nav-item">Add Game Category</Link>

//               {/* User Dropdown */}
//               <div className="user-dropdown">
//                 <button className="dropdown-btn" onClick={toggleDropdown}>
//                   {username}
//                 </button>
//                 {dropdownOpen && (
//                   <div className="dropdown-menu">
//                     {/* Show specific options based on role */}
//                     <Link to="/GameZoneOwner/ownerViewprofile" className="dropdown-item" >
//                       View Profile
//                     </Link>
//                     <Link to="/GameZoneOwner/ownerChangePassword" className="dropdown-item" >
//                       Change Password
//                     </Link>
//                     <button className="dropdown-item" onClick={handleLogout}>
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </>
//           ) : (
//             <Link to="/login" className="nav-item login-btn">LOGIN</Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default OwnerNavbar;


import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FaUser, 
  FaLock, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaGamepad,
  FaTachometerAlt,
  FaPlus,
  FaTags
} from "react-icons/fa";
import "./OwnerNavbar.css";
import logo from "../../images/icon.png";
import { getUserRole, isAuthenticated, getUserInfo } from "../../auth/JwtUtils";

const OwnerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = isAuthenticated();
  const userInfo = getUserInfo();
  const username = userInfo?.UserName || userInfo?.username || "Owner";
  const role = getUserRole();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.owner-user-dropdown')) {
        setDropdownOpen(false);
      }
      if (!event.target.closest('.owner-nav-links') && !event.target.closest('.owner-mobile-toggle')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/login");
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = (e) => {
    e.stopPropagation();
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav className="owner-game-navbar">
        <div className="owner-navbar-container">
          {/* Enhanced Logo */}
          <Link to="/GameZoneOwner/dashboard" className="owner-navbar-logo">
            <img src={logo || "/placeholder.svg"} alt="Game Zone Logo" className="owner-logo-img" />
            <span className="owner-logo-text">
              <span className="owner-game-text">GAME</span>
              <span className="owner-zone-text">ZONE</span>
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className={`owner-mobile-toggle ${mobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className="owner-toggle-line"></span>
            <span className="owner-toggle-line"></span>
            <span className="owner-toggle-line"></span>
          </button>

          {/* Navigation Links */}
          <div className={`owner-nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            {loggedIn ? (
              <>
                <Link 
                  to="/GameZoneOwner/dashboard" 
                  className={`owner-nav-item ${isActiveRoute('/GameZoneOwner/dashboard') ? 'active' : ''}`}
                >
                  <FaTachometerAlt className="owner-nav-icon" />
                  Dashboard
                </Link>
                
                <Link 
                  to="/GameZoneOwner/add-games" 
                  className={`owner-nav-item ${isActiveRoute('/GameZoneOwner/add-games') ? 'active' : ''}`}
                >
                  <FaGamepad className="owner-nav-icon" />
                  Manage Games
                </Link>
                
                <Link 
                  to="/GameZoneOwner/add-game-category" 
                  className={`owner-nav-item ${isActiveRoute('/GameZoneOwner/add-game-category') ? 'active' : ''}`}
                >
                  <FaTags className="owner-nav-icon" />
                  Categories
                </Link>

                {/* Enhanced User Dropdown */}
                <div className="owner-user-dropdown">
                  <button 
                    className={`owner-dropdown-btn ${dropdownOpen ? 'open' : ''}`}
                    onClick={toggleDropdown}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    <div className="owner-user-avatar">
                      {getInitials(username)}
                    </div>
                    <span className="owner-username">{username}</span>
                    <FaPlus className={`owner-dropdown-arrow ${dropdownOpen ? 'open' : ''}`} />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="owner-dropdown-menu">
                      <Link 
                        to="/GameZoneOwner/ownerViewprofile" 
                        className="owner-dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaUser className="owner-dropdown-icon" />
                        View Profile
                      </Link>
                      
                      <Link 
                        to="/GameZoneOwner/ownerChangePassword" 
                        className="owner-dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaLock className="owner-dropdown-icon" />
                        Change Password
                      </Link>
                      
                      <button 
                        className="owner-dropdown-item" 
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className="owner-dropdown-icon" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="owner-login-btn">
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div style={{ height: '70px' }}></div>
    </>
  );
};

export default OwnerNavbar;
