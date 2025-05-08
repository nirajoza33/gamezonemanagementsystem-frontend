// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../css/Navbar.css"; // Import styles
// import logo from "../images/icon.png"; // Import the logo
// import { getUserRole, isAuthenticated, getUserInfo } from "../auth/JwtUtils";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const loggedIn = isAuthenticated();
//   const userInfo = getUserInfo();
//   const username = userInfo?.username || "User";  // Fallback to "User" if no username
//   console.log("username:", username);  // Will print the username from the token


//   const handleLogout = () => {
//     sessionStorage.clear();
//     navigate("/login");
//   };

//   const role = getUserRole();

//   {
//     role === 'Admin' && (
//       <Link to="/admin/dashboard" className="nav-item">Dashboard</Link>
//     )
//   }
//   {
//     role === 'GameZoneOwner' && (
//       <>
//         <Link to="/GameZoneOwner/dashboard" className="nav-item">Dashboard</Link>
//         <Link to="/GameZoneOwner/add-games" className="nav-item">Add Games</Link>
//         <Link to="/GameZoneOwner/add-game-category" className="nav-item">Add Game Category</Link>
//       </>
//     )
//   }


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
//         <div className="nav-links">
//           <Link to="/" className="nav-item">HOME</Link>
//           {/* <Link to="/add-games" className="nav-item">Add Games</Link> */}
//           {/* <Link to="/login" className="nav-item login-btn">LOGIN</Link> */}

//           {loggedIn ? (
//             <Link to="/login" className="nav-item login-btn" onClick={handleLogout}>LOGOUT</Link>
//           ) : (
//             <Link to="/login" className="nav-item login-btn">LOGIN</Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;




import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Navbar.css"; // Import styles
import logo from "../images/icon.png"; // Import the logo
import { getUserRole, isAuthenticated, getUserInfo } from "../auth/JwtUtils";

const Navbar = () => {
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

  const handleChangePassword = () => {
    navigate("/change-password"); // Navigate to a change password page
  };

  const handleViewProfile = () => {
    navigate("/profile"); // Navigate to the profile page
  };

  const handleBooking = () => {
    navigate("/booking"); // Navigate to the profile page
  };

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
        <div className="nav-links">
          <Link to="/" className="nav-item">HOME</Link>

          
          {loggedIn ? (
            <>
            <Link to="/booking" className="nav-item">Book Game</Link>
            <Link to="/games" className="nav-item">Games</Link>

              {/* User Dropdown */}
              <div className="user-dropdown">
                <button className="dropdown-btn" onClick={toggleDropdown}>
                  {username}
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    {/* Show specific options based on role */}
                    <Link to="/user-profile" className="dropdown-item" onClick={handleViewProfile}>
                      View Profile
                    </Link>
                    <Link to="/change-password" className="dropdown-item" onClick={handleChangePassword}>
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

export default Navbar;





