// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../css/Navbar.css";
// import logo from "../images/icon.png";
// import { getUserRole, isAuthenticated, getUserInfo } from "../auth/JwtUtils";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const loggedIn = isAuthenticated();
//   const userInfo = getUserInfo();
//   const username = userInfo?.username || "User";
//   const role = getUserRole();

//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const handleLogout = () => {
//     sessionStorage.clear();
//     navigate("/login");
//   };

//   const toggleDropdown = () => {
//     setDropdownOpen((prev) => !prev);
//   };

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!e.target.closest(".user-dropdown")) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <nav className="game-navbar">
//       <div className="navbar-container">
//         {/* Logo */}
//         <Link to="/" className="navbar-logo">
//           <span className="logo-text">
//           <img src={logo} alt="Game Zone Logo" className="logo-img" />
//             <span className="game-text">GAME</span>
//             <span className="zone-text">ZONE</span>
//           </span>
//         </Link>

//         {/* Navigation */}
//         <div className="nav-links">
//           <Link to="/" className="nav-item">HOME</Link>

//           {loggedIn ? (
//             <>
//               <Link to="/User/games" className="nav-item">GAMES</Link>
//               <Link to="/User/review" className="nav-item">REVIEW</Link>

//               <div className="user-dropdown">
//                 <button className="dropdown-btn" onClick={toggleDropdown}>
//                   {username}
//                 </button>

//                 {dropdownOpen && (
//                   <div className="dropdown-menu">
//                     <Link to="/User/user-profile" className="dropdown-item">
//                       View Profile
//                     </Link>
//                     <Link to="/User/change-password" className="dropdown-item">
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

// export default Navbar;




import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import logo from "../images/icon.png";
import { getUserRole, isAuthenticated, getUserInfo } from "../auth/JwtUtils";
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaInstagram, FaBars, FaTimes, FaUser, FaLock, FaSignOutAlt, FaGamepad } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const userInfo = getUserInfo();
  const username = userInfo?.username || "User";
  const role = getUserRole();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-dropdown")) {
        setDropdownOpen(false);
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Prevent body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className={`game-navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <img src={logo || "/placeholder.svg"} alt="GameZone Logo" className="logo-img" />
            <span className="logo-text">
              <span className="logo-game">Play</span>
              <span className="logo-zone">Vana</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links">
            <Link to="/" className="nav-item">
              <span>HOME</span>
            </Link>
            <Link to="/games" className="nav-item">
              <span>GAMES</span>
            </Link>
            <Link to="/bookedGames" className="nav-item">
              <span>BOOKINGS</span>
            </Link>
            <Link to="/offers" className="nav-item">
              <span>OFFERS</span>
            </Link>
            <Link to="/about" className="nav-item">
              <span>ABOUT</span>
            </Link>
            <Link to="/review" className="nav-item">
              <span>REVIEW</span>
            </Link>
          </div>

          {/* User Section */}
          <div className="nav-user-section">
            {loggedIn ? (
              <div className="user-dropdown">
                <button className="dropdown-btn" onClick={toggleDropdown}>
                  <div className="user-avatar-small">
                    <span>{username.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="username-text">{username}</span>
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu show">
                    <div className="dropdown-header">
                      <div className="user-avatar-large">
                        <span>{username.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="user-info">
                        <span className="user-name">{username}</span>
                        <span className="user-role">{role || "User"}</span>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/User/user-profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FaUser className="dropdown-icon" />
                      <span>View Profile</span>
                    </Link>
                    <Link to="/User/change-password" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FaLock className="dropdown-icon" />
                      <span>Change Password</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <FaSignOutAlt className="dropdown-icon" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-btn">
                <div className="login-avatar">
                  <FaUser className="login-icon"/>
                </div>
                <span className="login-text">LOGIN</span>
              </Link>
            )}
          </div>

          {/* Desktop Social Icons */}
          <div className="social-icons">
            <a href="#" aria-label="Facebook" className="social-link facebook">
              <FaFacebookF />
              <span className="social-tooltip">Facebook</span>
            </a>
            <a href="#" aria-label="LinkedIn" className="social-link linkedin">
              <FaLinkedinIn />
              <span className="social-tooltip">LinkedIn</span>
            </a>
            <a href="#" aria-label="YouTube" className="social-link youtube">
              <FaYoutube />
              <span className="social-tooltip">YouTube</span>
            </a>
            <a href="#" aria-label="Instagram" className="social-link instagram">
              <FaInstagram />
              <span className="social-tooltip">Instagram</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
            <span className="menu-icon">
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div className={`mobile-overlay ${mobileMenuOpen ? "active" : ""}`} onClick={closeMobileMenu}></div>

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${mobileMenuOpen ? "active" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={logo || "/placeholder.svg"} alt="Logo" className="sidebar-logo-img" />
            <span className="sidebar-logo-text">
              <span className="logo-game">GAME</span>
              <span className="logo-zone">ZONE</span>
            </span>
          </div>
          <button className="sidebar-close" onClick={closeMobileMenu} aria-label="Close sidebar">
            <FaTimes />
          </button>
        </div>

        <div className="sidebar-content">
          {/* User Info Section */}
          {loggedIn && (
            <div className="sidebar-user-info">
              <div className="user-avatar">
                <span>{username.charAt(0).toUpperCase()}</span>
              </div>
              <div className="user-details">
                <span className="user-name">{username}</span>
                <span className="user-role">{role || "User"}</span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="sidebar-nav">
            <Link to="/" className="sidebar-nav-item" onClick={closeMobileMenu}>
              <FaGamepad className="sidebar-icon" />
              <span>HOME</span>
            </Link>
            <Link to="/games" className="sidebar-nav-item" onClick={closeMobileMenu}>
              <FaGamepad className="sidebar-icon" />
              <span>GAMES</span>
            </Link>
            <Link to="/bookedGames" className="sidebar-nav-item" onClick={closeMobileMenu}>
              <FaGamepad className="sidebar-icon" />
              <span>BOOKINGS</span>
            </Link>
            <Link to="/offers" className="sidebar-nav-item" onClick={closeMobileMenu}>
              <FaGamepad className="sidebar-icon" />
              <span>OFFERS</span>
            </Link>
            <Link to="/about" className="sidebar-nav-item" onClick={closeMobileMenu}>
              <FaGamepad className="sidebar-icon" />
              <span>ABOUT</span>
            </Link>
            <Link to="/review" className="sidebar-nav-item" onClick={closeMobileMenu}>
              <FaGamepad className="sidebar-icon" />
              <span>REVIEW</span>
            </Link>
          </nav>

          {/* User Actions */}
          {loggedIn ? (
            <div className="sidebar-user-actions">
              <Link to="/User/user-profile" className="sidebar-action-item" onClick={closeMobileMenu}>
                <FaUser className="sidebar-icon" />
                <span>View Profile</span>
              </Link>
              <Link to="/User/change-password" className="sidebar-action-item" onClick={closeMobileMenu}>
                <FaLock className="sidebar-icon" />
                <span>Change Password</span>
              </Link>
              <button className="sidebar-action-item logout-btn" onClick={handleLogout}>
                <FaSignOutAlt className="sidebar-icon" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="sidebar-auth">
              <Link to="/login" className="sidebar-login-btn" onClick={closeMobileMenu}>
                <FaUser className="sidebar-icon" />
                <span>LOGIN</span>
              </Link>
            </div>
          )}

          {/* Social Icons */}
          <div className="sidebar-social">
            <span className="social-title">Follow Us</span>
            <div className="sidebar-social-icons">
              <a href="#" aria-label="Facebook" className="sidebar-social-link facebook">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="LinkedIn" className="sidebar-social-link linkedin">
                <FaLinkedinIn />
              </a>
              <a href="#" aria-label="YouTube" className="sidebar-social-link youtube">
                <FaYoutube />
              </a>
              <a href="#" aria-label="Instagram" className="sidebar-social-link instagram">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
