// // Sidebar.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';
// import logo from '../../images/icon.png';
// import './Sidebar.css';
// import { isAuthenticated } from '../../auth/JwtUtils';
// import { FaTachometerAlt, FaGamepad, FaLayerGroup, FaSignInAlt } from 'react-icons/fa';

// const Sidebar = () => {
//     const loggedIn = isAuthenticated();

//     return (
//         <div className="sidebar bg-dark text-white d-flex flex-column p-3">
//             {/* Logo */}
//             <Link to="/GameZoneOwner/dashboard" className="navbar-logo d-flex align-items-center mb-4 text-white ">
//                 <img src={logo} alt="Game Zone Logo" className="logo-img me-2" />
//                 <span className="logo-text">
//                     <span className="game-text">GAME</span>
//                     <span className="zone-text">ZONE</span>
//                 </span>
//             </Link>

//             {/* Nav Links */}
//             {loggedIn && (
//                 <>
//                     <Link to="/GameZoneOwner/dashboard" className="nav-link text-white mb-2">
//                         <FaTachometerAlt className="me-2" /> Dashboard
//                     </Link>
//                     <Link to="/GameZoneOwner/add-games" className="nav-link text-white mb-2">
//                         <FaGamepad className="me-2" /> Add Games
//                     </Link>
//                     <Link to="/GameZoneOwner/add-game-category" className="nav-link text-white mb-2">
//                         <FaLayerGroup className="me-2" /> Add Game Category
//                     </Link>
//                 </>
//             )}

//             {!loggedIn && (
//                 <Link to="/login" className="nav-link text-white mt-auto">LOGIN</Link>
//             )}
//         </div>
//     );
// };

// export default Sidebar;


"use client"

import { useState, useEffect } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Gamepad2,
  FolderPlus,
  TrendingUp,
  Settings,
  Crown,
  Zap,
  Activity,
  ChevronRight,
  Sparkles,
  Gift,
} from "lucide-react"
import { isAuthenticated } from "../../auth/JwtUtils"
import "./Sidebar.css"
// import OffersManager from "./OffersManager"

const Sidebar = ({ isOpen, closeSidebar }) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const [hoveredItem, setHoveredItem] = useState(null)
  const location = useLocation()
  const loggedIn = isAuthenticated()

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/GameZoneOwner/dashboard",
      color: "#ff2a6d",
      description: "Overview & Analytics",
    },
    {
      title: "Game Management",
      icon: <Gamepad2 size={20} />,
      path: "/GameZoneOwner/add-games",
      color: "#ffd700",
      description: "Manage Your Games",
    },
    {
      title: "Categories",
      icon: <FolderPlus size={20} />,
      path: "/GameZoneOwner/add-game-category",
      color: "#4cd964",
      description: "Game Categories",
    },
    {
      title: "Analytics",
      icon: <TrendingUp size={20} />,
      path: "/GameZoneOwner/analytics",
      color: "#ff6b9d",
      description: "Performance Insights",
    },
    {
    title: "Running Status",
    icon: <Activity size={20} />,
    path: "/GameZoneOwner/running-status",
    color: "#38bdf8",
    description: "Monitor Live Status",
  },
    {
      title: "Settings",
      icon: <Settings size={20} />,
      path: "/GameZoneOwner/settings",
      color: "#9ca3af",
      description: "Account Settings",
    },
     {
      title: "Offers",
      icon: <Gift size={20} />,
      path: "/GameZoneOwner/offers",
      color: "#9ca3af",
      description: "Offers Manager",
    },
  ]

  const quickActions = [
    { title: "Quick Upload", icon: <Zap size={16} />, action: "upload", color: "#ff2a6d" },
    { title: "Live Stats", icon: <Activity size={16} />, action: "stats", color: "#4cd964" },
  ]

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (window.innerWidth < 992) {
      closeSidebar && closeSidebar()
    }
  }, [location.pathname, closeSidebar])

  // Handle quick actions
  const handleQuickAction = (action) => {
    switch (action) {
      case "upload":
        console.log("Opening quick upload...")
        break
      case "stats":
        console.log("Opening live stats...")
        break
      default:
        break
    }
  }

  if (!loggedIn) {
    return null
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && window.innerWidth < 992 && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <aside className={`gamezone-sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
        {/* Sidebar Background Effects */}
        <div className="sidebar-background">
          <div className="bg-grid"></div>
          <div className="bg-gradient"></div>
          <div className="floating-orbs">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
          </div>
        </div>

        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="brand-section">
            <div className="brand-icon">
              <Crown size={28} />
              <div className="icon-glow"></div>
            </div>
            <div className="brand-text">
              <h1 className="brand-title">
                <span className="title-game">GAME</span>
                <span className="title-zone">ZONE</span>
              </h1>
              <p className="brand-subtitle">
                <Sparkles size={12} />
                Owner Portal
              </p>
            </div>
          </div>
          <div className="header-decoration"></div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-navigation">
          <div className="nav-section">
            <div className="section-header">
              <span>Game Management</span>
            </div>

            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? "nav-active" : ""}`}
                onClick={closeSidebar}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  "--item-color": item.color,
                  "--item-glow": `${item.color}33`,
                }}
              >
                <div className="nav-icon">
                  {item.icon}
                  <div className="icon-bg"></div>
                </div>
                <div className="nav-content">
                  <span className="nav-title">{item.title}</span>
                  <span className="nav-description">{item.description}</span>
                </div>
                <ChevronRight size={16} className="nav-arrow" />

                {/* Hover Effect */}
                {hoveredItem === index && <div className="nav-hover-effect"></div>}

                {/* Active Indicator */}
                <div className="nav-indicator"></div>
              </NavLink>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="nav-section quick-actions">
            <div className="section-header">
              <span>Quick Actions</span>
            </div>

            {quickActions.map((action, index) => (
              <button
                key={index}
                className="quick-action-item"
                onClick={() => handleQuickAction(action.action)}
                style={{ "--action-color": action.color }}
              >
                <div className="action-icon">{action.icon}</div>
                <span className="action-title">{action.title}</span>
                <div className="action-pulse"></div>
              </button>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        {/* <div className="sidebar-footer">
          <div className="footer-stats">
            <div className="stat-item">
              <div className="stat-icon">
                <Activity size={16} />
              </div>
              <div className="stat-content">
                <div className="stat-value">98.5%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <Crown size={16} />
              </div>
              <div className="stat-content">
                <div className="stat-value">Pro</div>
                <div className="stat-label">Account</div>
              </div>
            </div>
          </div>
          <div className="footer-decoration"></div>
        </div> */}

        {/* Sidebar Border Glow */}
        <div className="sidebar-border-glow"></div>
      </aside>
    </>
  )
}

export default Sidebar

