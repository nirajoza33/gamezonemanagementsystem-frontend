// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Users,
//   Gamepad,
//   CreditCard,
//   Settings,
//   ShieldCheck,
// } from "lucide-react";

// const Sidebar = ({ isOpen, closeSidebar }) => {
//   const items = [
//     { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/Admin/dashboard" },
//     { title: "User Management", icon: <Users size={20} />, path: "/Admin/users" },
//     { title: "Game Management", icon: <Gamepad size={20} />, path: "/Admin/games" },
//     { title: "Subscription Plans", icon: <CreditCard size={20} />, path: "/Admin/subscriptions" },
//     { title: "Permissions", icon: <ShieldCheck size={20} />, path: "/Admin/permissions" },
//     { title: "Settings", icon: <Settings size={20} />, path: "/Admin/settings" },
//   ];

//   return (
//     <>
//       {/* Overlay for mobile */}
//       {window.innerWidth < 992 && isOpen && (
//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
//           style={{ zIndex: 1040 }}
//           onClick={closeSidebar}
//         ></div>
//       )}

//       <div
//         className={`bg-dark text-white position-fixed top-0 start-0 h-100 d-flex flex-column ${
//           isOpen ? "d-block" : "d-none d-lg-block"
//         }`}
//         style={{ width: "16rem", zIndex: 1045 }}
//       >
//         <div className="border-bottom border-secondary-subtle p-3">
//           <h1 className="fs-4 fw-bold mb-0">
//             <span style={{ color: "var(--primary)" }}>Game</span>
//             <span style={{ color: "var(--accent)" }}>Zone</span>
//           </h1>
//         </div>

//         <div className="flex-grow-1 overflow-auto">
//           {items.map((item, idx) => (
//             <NavLink
//               key={idx}
//               to={item.path}
//               className={({ isActive }) =>
//                 `d-flex align-items-center text-white px-3 py-2 text-decoration-none ${
//                   isActive ? "bg-primary" : "hover-bg-dark"
//                 }`
//               }
//               onClick={closeSidebar}
//             >
//               {item.icon}
//               <span className="ms-2">{item.title}</span>
//             </NavLink>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;

"use client"

import { useState, useEffect } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Gamepad,
  CreditCard,
  Settings,
  ShieldCheck,
  ChevronRight,
  Home,
  BarChart3,
  FileText,
  HelpCircle,
  Zap,
} from "lucide-react"
import "./AdminSidebar.css"

const Sidebar = ({ isOpen, closeSidebar }) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const [hoveredItem, setHoveredItem] = useState(null)
  const location = useLocation()

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/Admin/dashboard",
      color: "#ff2a6d",
    },
    {
      title: "User Management",
      icon: <Users size={20} />,
      path: "/Admin/users",
      color: "#05d9e8",
    },
    {
      title: "Game Management",
      icon: <Gamepad size={20} />,
      path: "/Admin/games",
      color: "#ffd700",
    },
    // {
    //   title: "Subscription Plans",
    //   icon: <CreditCard size={20} />,
    //   path: "/Admin/subscriptions",
    //   color: "#4cd964",
    // },
    // {
    //   title: "Analytics",
    //   icon: <BarChart3 size={20} />,
    //   path: "/Admin/analytics",
    //   color: "#ff6b9d",
    // },
    // {
    //   title: "Reports",
    //   icon: <FileText size={20} />,
    //   path: "/Admin/reports",
    //   color: "#ffed4e",
    // },
    // {
    //   title: "Permissions",
    //   icon: <ShieldCheck size={20} />,
    //   path: "/Admin/permissions",
    //   color: "#ff8c42",
    // },
    // {
    //   title: "Settings",
    //   icon: <Settings size={20} />,
    //   path: "/Admin/settings",
    //   color: "#9ca3af",
    // },
  ]

  const quickActions = [
    { title: "Quick Stats", icon: <Zap size={16} />, action: "stats" },
    { title: "Help Center", icon: <HelpCircle size={16} />, action: "help" },
  ]

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (window.innerWidth < 992) {
      closeSidebar()
    }
  }, [location.pathname, closeSidebar])

  // Handle submenu toggle
  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index)
  }

  // Handle quick actions
  const handleQuickAction = (action) => {
    switch (action) {
      case "stats":
        console.log("Opening quick stats...")
        break
      case "help":
        console.log("Opening help center...")
        break
      default:
        break
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && window.innerWidth < 992 && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <aside className={`futuristic-sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
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
              <Home size={24} />
              <div className="icon-glow"></div>
            </div>
            <div className="brand-text">
              <h1 className="brand-title">
                <span className="title-play">PLAY</span>
                <span className="title-vana">VANA</span>
              </h1>
              <p className="brand-subtitle">Admin Control</p>
            </div>
          </div>
          <div className="header-decoration"></div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-navigation">
          <div className="nav-section">
            <div className="section-header">
              <span>Main Navigation</span>
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
                <span className="nav-title">{item.title}</span>
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
              <button key={index} className="quick-action-item" onClick={() => handleQuickAction(action.action)}>
                <div className="action-icon">{action.icon}</div>
                <span className="action-title">{action.title}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="footer-stats">
            <div className="stat-item">
              <div className="stat-value">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
          <div className="footer-decoration"></div>
        </div>

        {/* Sidebar Border Glow */}
        <div className="sidebar-border-glow"></div>
      </aside>
    </>
  )
}

export default Sidebar
