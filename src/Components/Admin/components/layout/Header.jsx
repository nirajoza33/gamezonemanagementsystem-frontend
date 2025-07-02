// import React, { useState } from "react"
// import { Bell, User, LogOut, Menu } from "lucide-react"
// import { useAuthStore } from "../../store/authStore"
// import { useNavigate } from "react-router-dom"



// const Header = ({ toggleSidebar }) => {
//   const { user, logout } = useAuthStore()
//   const [showProfileMenu, setShowProfileMenu] = useState(false)
//   const [showNotifications, setShowNotifications] = useState(false)
//   const navigate = useNavigate();

//   const toggleProfileMenu = () => {
//     setShowProfileMenu(!showProfileMenu)
//     if (showNotifications) setShowNotifications(false)
//   }

//   const toggleNotifications = () => {
//     setShowNotifications(!showNotifications)
//     if (showProfileMenu) setShowProfileMenu(false)
//   }

//   const handleProfileClick = () => {
//     navigate("/admin/viewProfile");
//   };

//     const handleChangePasswordClick = () => {
//     navigate("/admin/changePassword");
//   };


//   const handleLogout = () => {
//     sessionStorage.clear();
//     navigate("/login");
//   };

//   return (
//     <header className="bg-dark sticky-top border-bottom border-secondary-subtle">
//       <div className="d-flex align-items-center justify-content-between px-3 py-2">
//         {/* Left - Logo & Toggle */}
//         <div className="d-flex align-items-center">
//           <button onClick={toggleSidebar} className="btn btn-link d-lg-none text-white me-2 p-1">
//             <Menu size={24} />
//           </button>
//           <h1 className="fs-4 fw-bold text-white m-0 d-flex align-items-center">
//             <span style={{ color: "var(--primary)" }}>Game</span>
//             <span style={{ color: "var(--accent)" }}>Zone</span>
//             <span style={{ color: "var(--secondary)" }} className="ms-1">Admin</span>
//           </h1>
//         </div>

//         {/* Right - Notification & Profile */}
//         <div className="d-flex align-items-center">
//           {/* Notification bell */}
//           <div className="position-relative me-3">
//             <button onClick={toggleNotifications} className="btn btn-link text-white p-1">
//               <Bell size={20} />
//               <span className="position-absolute top-0 end-0 translate-middle bg-primary rounded-circle" style={{ width: "8px", height: "8px" }}></span>
//             </button>

//             {showNotifications && (
//               <div className="position-absolute end-0 mt-2 dropdown-menu show fadeIn" style={{ width: "18rem" }}>
//                 <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
//                   <h6 className="fw-medium text-white mb-0">Notifications</h6>
//                   <span className="badge bg-primary bg-opacity-25 text-primary rounded-pill">3 new</span>
//                 </div>
//                 <div style={{ maxHeight: "24rem", overflowY: "auto" }}>
//                   <div className="dropdown-item text-white border-bottom">
//                     <p className="mb-1">New game submission from <span className="fw-medium">NeonGames Inc.</span></p>
//                     <p className="text-white-50 small mb-0">10 minutes ago</p>
//                   </div>
//                   <div className="dropdown-item text-white border-bottom">
//                     <p className="mb-1">User <span className="fw-medium">John Doe</span> reported an issue</p>
//                     <p className="text-white-50 small mb-0">2 hours ago</p>
//                   </div>
//                   <div className="dropdown-item text-white">
//                     <p className="mb-1">New game zone owner registration</p>
//                     <p className="text-white-50 small mb-0">Yesterday</p>
//                   </div>
//                 </div>
//                 <div className="border-top p-2 text-center">
//                   <button className="btn btn-link text-secondary">View all notifications</button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* User profile */}
//           <div className="position-relative">
//             <button onClick={toggleProfileMenu} className="btn btn-link text-white d-flex align-items-center p-1">
//               <div
//                 className="rounded-circle d-flex align-items-center justify-content-center text-white fw-medium"
//                 style={{
//                   width: "32px",
//                   height: "32px",
//                   background: "linear-gradient(to bottom right, var(--primary), var(--secondary))"
//                 }}
//               >
//                 {user?.name?.charAt(0)}
//               </div>
//               <span className="d-none d-md-block ms-2 small fw-medium">{user?.name}</span>
//             </button>

//             {showProfileMenu && (
//               <div className="position-absolute end-0 mt-2 dropdown-menu show fadeIn" style={{ width: "12rem" }}>
//                 <div className="px-3 py-2 border-bottom">
//                   <p className="fw-medium text-white mb-0">{user?.name}</p>
//                   <p className="text-white-50 small mb-1">{user?.email}</p>
//                   <span className="badge bg-primary bg-opacity-25 text-primary">{user?.role}</span>
//                 </div>
//                 <div className="mt-1">
//                   <button
//                     className="dropdown-item text-white d-flex align-items-center"
//                     onClick={handleProfileClick}
//                   >
//                     <User size={16} className="me-2" />
//                     <span>Profile</span>
//                   </button>

//                    <button
//                     className="dropdown-item text-white d-flex align-items-center"
//                     onClick={handleChangePasswordClick}
//                   >
//                     <User size={16} className="me-2" />
//                     <span>Change Password</span>
//                   </button>
//                   <button onClick={handleLogout} className="dropdown-item text-danger d-flex align-items-center">
//                     <LogOut size={16} className="me-2" />
//                     <span>Logout</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }

// export default Header

"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Menu, User, Settings, Bell, ChevronDown, Shield, Power } from "lucide-react"
import { getUserInfo, getToken, logout } from "../../../../auth/JwtUtils"
import "./AdminHeader.css"

const Header = ({ toggleSidebar }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications] = useState([
    {
      id: 1,
      message: "New game submission from NeonGames",
      time: "10 min ago",
      type: "game",
    },
    {
      id: 2,
      message: "User John Doe reported an issue",
      time: "2 hours ago",
      type: "user",
    },
    {
      id: 3,
      message: "New owner registration pending",
      time: "Yesterday",
      type: "owner",
    },
  ])

  const profileRef = useRef(null)
  const notificationRef = useRef(null)
  const navigate = useNavigate()

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getToken()
        if (token) {
          const userInfo = getUserInfo()
          if (userInfo) {
            setUser({
              name: userInfo.UserName || userInfo.name || "Admin User",
              email: userInfo.sub || userInfo.email || "admin@playvana.com",
              role: getRoleDisplay(userInfo.RoleId) || "System Admin",
              userId: userInfo.UserId || userInfo.id,
              roleId: userInfo.RoleId || 1,
              avatar: userInfo.avatar || null,
            })
          }
        } else {
          // Fallback data if no token
          setUser({
            name: "Admin User",
            email: "admin@playvana.com",
            role: "System Admin",
            userId: 1,
            roleId: 1,
            avatar: null,
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setUser({
          name: "Admin User",
          email: "admin@playvana.com",
          role: "System Admin",
          userId: 1,
          roleId: 1,
          avatar: null,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const getRoleDisplay = (roleId) => {
    switch (roleId) {
      case 1:
        return "System Admin"
      case 2:
        return "GameZone Owner"
      case 3:
        return "User"
      default:
        return "System Admin"
    }
  }

  const getRoleColor = (roleId) => {
    switch (roleId) {
      case 1:
        return "#ff2a6d"
      case 2:
        return "#ffd700"
      case 3:
        return "#05d9e8"
      default:
        return "#ff2a6d"
    }
  }

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu)
    if (showNotifications) setShowNotifications(false)
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    if (showProfileMenu) setShowProfileMenu(false)
  }

  const handleProfileClick = () => {
    navigate("/admin/viewProfile")
    setShowProfileMenu(false)
  }

  const handleChangePasswordClick = () => {
    navigate("/admin/changePassword")
    setShowProfileMenu(false)
  }

  const handleLogout = () => {
    try {
      logout()
      sessionStorage.clear()
      localStorage.clear()
      navigate("/login")
    } catch (error) {
      console.error("Logout error:", error)
      navigate("/login")
    }
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close menus on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowProfileMenu(false)
        setShowNotifications(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const getUserInitials = (name) => {
    if (!name) return "AU"
    const names = name.split(" ")
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "game":
        return "🎮"
      case "user":
        return "👤"
      case "owner":
        return "👑"
      default:
        return "📢"
    }
  }

  return (
    <header className="modern-header">
      <div className="header-wrapper">
        {/* Left Section */}
        <div className="header-left">
          <button onClick={toggleSidebar} className="sidebar-toggle" aria-label="Toggle Sidebar">
            <Menu size={20} />
            <div className="button-ripple"></div>
          </button>

          <div className="brand-container">
            <div className="brand-logo">
              <span className="logo-play">PLAY</span>
              <span className="logo-vana">VANA</span>
              <div className="logo-pulse"></div>
            </div>
            <div className="admin-panel-badge">
              <Shield size={12} />
              <span>Admin Panel</span>
            </div>
          </div>
        </div>

        {/* Center Section */}
        <div className="header-center">
          <div className="system-status">
            <div className="status-dot"></div>
            <span>System Online</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="header-right">
          {/* Notifications */}
          <div className="notification-section" ref={notificationRef}>
            <button onClick={toggleNotifications} className="notification-button" aria-label="View Notifications">
              <Bell size={18} />
              {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
              <div className="button-glow"></div>
            </button>

            {showNotifications && (
              <div className="dropdown-container notifications-dropdown">
                <div className="dropdown-arrow"></div>
                <div className="dropdown-header">
                  <h6>Notifications</h6>
                  <span className="notification-count">{notifications.length}</span>
                </div>
                <div className="dropdown-body">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="notification-item">
                      <div className="notification-icon">{getNotificationIcon(notification.type)}</div>
                      <div className="notification-content">
                        <p>{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="dropdown-footer">
                  <button className="view-all-notifications">View All Notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="profile-section" ref={profileRef}>
            <button onClick={toggleProfileMenu} className="profile-button" aria-label="User Menu">
              <div className="user-avatar">
                {user?.avatar ? (
                  <img src={user.avatar || "/placeholder.svg"} alt={user?.name} />
                ) : (
                  <span>{loading ? "..." : getUserInitials(user?.name)}</span>
                )}
                <div className="avatar-ring"></div>
              </div>
              <div className="user-details">
                <span className="user-name">{loading ? "Loading..." : user?.name || "Admin User"}</span>
                <span className="user-role" style={{ color: getRoleColor(user?.roleId) }}>
                  {loading ? "..." : user?.role || "System Admin"}
                </span>
              </div>
              <ChevronDown size={16} className={`chevron ${showProfileMenu ? "rotated" : ""}`} />
            </button>

            {showProfileMenu && (
              <div className="dropdown-container profile-dropdown">
                <div className="dropdown-arrow"></div>

                {/* Profile Header */}
                <div className="profile-header">
                  <div className="profile-avatar-large">
                    {user?.avatar ? (
                      <img src={user.avatar || "/placeholder.svg"} alt={user?.name} />
                    ) : (
                      <span>{loading ? "..." : getUserInitials(user?.name)}</span>
                    )}
                    <div className="avatar-status"></div>
                  </div>
                  <div className="profile-info">
                    <h5>{loading ? "Loading..." : user?.name || "Admin User"}</h5>
                    <p>{loading ? "Loading..." : user?.email || "admin@playvana.com"}</p>
                    <div className="online-status">
                      <div className="status-indicator"></div>
                      <span>Online</span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="profile-menu">
                  <button className="menu-item" onClick={handleProfileClick}>
                    <div className="menu-icon">
                      <User size={16} />
                    </div>
                    <span>View Profile</span>
                    <div className="menu-arrow"></div>
                  </button>

                  <button className="menu-item" onClick={handleChangePasswordClick}>
                    <div className="menu-icon">
                      <Settings size={16} />
                    </div>
                    <span>Change Password</span>
                    <div className="menu-arrow"></div>
                  </button>

                  <div className="menu-separator"></div>

                  <button onClick={handleLogout} className="menu-item logout-item">
                    <div className="menu-icon">
                      <Power size={16} />
                    </div>
                    <span>Logout</span>
                    <div className="menu-arrow"></div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Header Glow Effect */}
      <div className="header-glow"></div>
    </header>
  )
}

export default Header
