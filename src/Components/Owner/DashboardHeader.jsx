// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './DashboardHeader.css'; // Move header-specific styles here
// import { getUserInfo, isAuthenticated } from '../../auth/JwtUtils';
// import { FaUserCircle, FaCaretDown } from 'react-icons/fa'; // Font Awesome icons

// const DashboardHeader = () => {
//   const navigate = useNavigate();
//   const loggedIn = isAuthenticated();
//   const userInfo = getUserInfo();
//   const username = userInfo?.username || 'User';

//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const handleLogout = () => {
//     sessionStorage.clear();
//     navigate('/login');
//   };

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   return (
//     <header className="dashboard-header d-flex justify-content-end align-items-center p-3 bg-light border-bottom">
//       {loggedIn && (
//         <div className="user-menu position-relative me-4">
//           <button className="user-button btn btn-light d-flex align-items-center" onClick={toggleDropdown}>
//             <FaUserCircle size={20} className="me-2" />
//             <span className="username">{username}</span>
//             <FaCaretDown className="ms-2" />
//           </button>
//           {dropdownOpen && (
//             <div className="dropdown-box dropdown-menu show mt-2 shadow">
//               <Link to="/GameZoneOwner/ownerViewprofile" className="dropdown-item">View Profile</Link>
//               <Link to="/GameZoneOwner/ownerChangePassword" className="dropdown-item">Change Password</Link>
//               <button className="dropdown-item" onClick={handleLogout}>Logout</button>
//             </div>
//           )}
//         </div>
//       )}
//     </header>
//   );
// };

// export default DashboardHeader;

"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Menu, User, Settings, Bell, ChevronDown, Shield, Power, Crown, Gamepad2 } from 'lucide-react'
import { getUserInfo, isAuthenticated } from "../../auth/JwtUtils"
import "./DashboardHeader.css"

const DashboardHeader = ({ toggleSidebar }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications] = useState([
    {
      id: 1,
      message: "New game uploaded successfully",
      time: "5 min ago",
      type: "success",
    },
    {
      id: 2,
      message: "Revenue milestone reached!",
      time: "1 hour ago",
      type: "achievement",
    },
    {
      id: 3,
      message: "Category update pending review",
      time: "2 hours ago",
      type: "info",
    },
  ])

  const profileRef = useRef(null)
  const notificationRef = useRef(null)
  const navigate = useNavigate()

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const loggedIn = isAuthenticated()
        if (loggedIn) {
          const userInfo = getUserInfo()
          if (userInfo) {
            setUser({
              name: userInfo.UserName || userInfo.username || "Game Zone Owner",
              email: userInfo.sub || userInfo.email || "owner@gamezone.com",
              role: "Game Zone Owner",
              userId: userInfo.UserId || userInfo.id,
              avatar: userInfo.avatar || null,
            })
          }
        } else {
          setUser({
            name: "Game Zone Owner",
            email: "owner@gamezone.com",
            role: "Game Zone Owner",
            userId: 1,
            avatar: null,
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setUser({
          name: "Game Zone Owner",
          email: "owner@gamezone.com",
          role: "Game Zone Owner",
          userId: 1,
          avatar: null,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu)
    if (showNotifications) setShowNotifications(false)
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    if (showProfileMenu) setShowProfileMenu(false)
  }

  const handleProfileClick = () => {
    navigate("/GameZoneOwner/ownerViewprofile")
    setShowProfileMenu(false)
  }

  const handleChangePasswordClick = () => {
    navigate("/GameZoneOwner/ownerChangePassword")
    setShowProfileMenu(false)
  }

  const handleLogout = () => {
    try {
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

  const getUserInitials = (name) => {
    if (!name) return "GO"
    const names = name.split(" ")
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return "✅"
      case "achievement":
        return "🏆"
      case "info":
        return "ℹ️"
      default:
        return "📢"
    }
  }

  return (
    <header className="gamezone-header">
      <div className="header-wrapper">
        {/* Left Section */}
        <div className="header-left">
          <button onClick={toggleSidebar} className="sidebar-toggle" aria-label="Toggle Sidebar">
            <Menu size={20} />
            <div className="button-ripple"></div>
          </button>

          <div className="brand-container">
            <div className="brand-logo">
              <span className="logo-game">GAME</span>
              <span className="logo-zone">ZONE</span>
              <div className="logo-pulse"></div>
            </div>
            <div className="owner-panel-badge">
              <Crown size={12} />
              <span>Owner Portal</span>
            </div>
          </div>
        </div>

        {/* Center Section */}
        <div className="header-center">
          <div className="system-status">
            <div className="status-dot"></div>
            <span>Games Online</span>
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
                <span className="user-name">{loading ? "Loading..." : user?.name || "Game Zone Owner"}</span>
                <span className="user-role">{loading ? "..." : user?.role || "Owner"}</span>
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
                    <h5>{loading ? "Loading..." : user?.name || "Game Zone Owner"}</h5>
                    <p>{loading ? "Loading..." : user?.email || "owner@gamezone.com"}</p>
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

export default DashboardHeader
