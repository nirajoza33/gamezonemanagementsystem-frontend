// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { getToken, getUserInfo, logout } from '../../auth/JwtUtils'; // Import logout function
// import '../../css/UserProfile.css';
// import OwnerNavbar from './OwnerNavbar';

// const OwnerViewProfile = () => {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState(null);
//   const [bio, setBio] = useState('');
//   const [phone, setPhone] = useState('');
//   const [email, setEmail] = useState('');
//   const [userName, setUserName] = useState('');
//   const [updateSuccess, setUpdateSuccess] = useState(false);
//   const [showModal, setShowModal] = useState(false); // To control the visibility of the modal
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch user data when the component is mounted
//     const fetchUserData = async () => {
//       try {
//         const token = getToken(); // Get token from session or localStorage
//         if (!token) {
//           setError("No token found. Please log in.");
//           return;
//         }

//         const userInfo = getUserInfo(); // Decode the JWT to get user info
//         if (userInfo) {
//           setUser(userInfo); // Set user info in the state
//           setBio(userInfo.Bio || '');
//           setPhone(userInfo.Phone || '');
//           setEmail(userInfo.sub || '');
//           setUserName(userInfo.UserName || '');
//         } else {
//           setError("Error: No valid user data.");
//         }
//       } catch (err) {
//         setError("Error fetching user data.");
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleLogout = () => {
//     logout(); // Calls logout function from jwtUtils.js
//     navigate('/login');
//   };


//   // const handleUpdate = async (e) => {
//   //     e.preventDefault(); // Prevent form submission
//   //     const token = getToken();
//   //     if (!token) {
//   //       setError("You must be logged in to update your profile.");
//   //       return;
//   //     }

//   //     try {
//   //       const userId = user.UserId; // Get user ID
//   //       const updatedData = {
//   //         Bio: bio,
//   //         Phone: phone,
//   //         Email: email,
//   //         UserName: userName,
//   //       };

//   //       const response = await axios.put(
//   //         `https://localhost:7186/api/Tblusers/${userId}`, // Replace with your API URL
//   //         updatedData,
//   //         {
//   //           headers: {
//   //             Authorization: `Bearer ${token}`,
//   //           },
//   //         }
//   //       );

//   //       if (response.status === 200) {
//   //         setUpdateSuccess(true); // Indicate the update was successful
//   //         setUser((prevState) => ({
//   //           ...prevState,
//   //           Bio: bio,
//   //           Phone: phone,
//   //           Email: email,
//   //           UserName: userName,
//   //         }));
//   //         setShowModal(false); // Close the modal after saving
//   //       }
//   //     } catch (err) {
//   //       setError("Error updating profile.");
//   //     }
//   // };

//   useEffect(() => {
//     if (updateSuccess) {
//       const timer = setTimeout(() => setUpdateSuccess(false), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [updateSuccess]);

//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     const token = getToken();
//     if (!token || !user) {
//       setError("You must be logged in to update your profile.");
//       return;
//     }

//     const updatedData = {
//       Bio: bio,
//       Phone: phone,
//       Email: email,
//       UserName: userName,
//     };

//     try {
//       const response = await axios.put(
//         `https://localhost:7186/api/Tblusers/${user.UserId}`,
//         updatedData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 204) {
//         setUpdateSuccess(true);
//         setUser((prev) => ({
//           ...prev,
//           ...updatedData,
//         }));
//         setShowModal(false);
//       }
//     } catch (err) {
//       setError("Failed to update profile.");
//     }
//   };

//   if (error) {
//     return <div className="error-message">{error}</div>;
//   }

//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="profile-page">
//       <OwnerNavbar />
//       <h2>Profile Information</h2>
//       <div className="profile-details">
//         <div>
//           <strong>Username:</strong> {user.UserName}
//         </div>
//         <div>
//           <strong>Email:</strong> {user.sub}
//         </div>
//         <div>
//           <strong>Phone:</strong> {user.Phone}
//         </div>
//         <div>
//           <strong>Bio:</strong> {user.Bio || 'No bio available.'}
//         </div>
//         <div>
//           <strong>Role:</strong> {user.RoleId == 1 ? 'Admin' : user.RoleId == 2 ? 'GameZoneOwner' : `User`}
//         </div>
//       </div>

//       {/* Update Button */}
//       <button onClick={() => setShowModal(true)}>Update Profile</button>

//       {/* Modal for updating profile */}
//       {showModal && (
//         <div className="modal">
//           <div className="modal-content">
//             <h3>Update Profile</h3>
//             <form onSubmit={handleUpdate}>
//               <div>
//                 <label>Bio:</label>
//                 <input
//                   type="text"
//                   value={bio}
//                   onChange={(e) => setBio(e.target.value)}
//                   placeholder="Update your bio"
//                 />
//               </div>
//               <div>
//                 <label>Phone:</label>
//                 <input
//                   type="text"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   placeholder="Update your phone number"
//                 />
//               </div>
//               <div>
//                 <label>Email:</label>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Update your email"
//                 />
//               </div>
//               <div>
//                 <label>Username:</label>
//                 <input
//                   type="text"
//                   value={userName}
//                   onChange={(e) => setUserName(e.target.value)}
//                   placeholder="Update your username"
//                 />
//               </div>
//               <button type="submit">Save</button>
//               <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
//             </form>
//           </div>
//         </div>
//       )}

//       {updateSuccess && <div className="success-message">Profile updated successfully!</div>}
//     </div>
//   );
// };

// export default OwnerViewProfile;

"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { FaUser, FaUserTag, FaCheck, FaExclamationTriangle } from "react-icons/fa"
import { User, Mail, Phone, FileText, Shield, Settings, LogOut, Edit3, Save, X } from "lucide-react"
import { getToken, getUserInfo, logout } from "../../auth/JwtUtils"
import Sidebar from "./Sidebar"
import DashboardHeader from "./DashboardHeader"
import toast, { Toaster } from "react-hot-toast"
import "./OwnerViewProfile.css"

const OwnerViewProfile = () => {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bio, setBio] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const token = getToken()
        if (!token) {
          setError("No token found. Please log in.")
          toast.error("Authentication required!")
          return
        }

        const userInfo = getUserInfo()
        if (userInfo) {
          setUser(userInfo)
          setBio(userInfo.Bio || "")
          setPhone(userInfo.Phone || "")
          setEmail(userInfo.sub || "")
          setUserName(userInfo.UserName || "")
        } else {
          setError("Error: No valid user data.")
          toast.error("Failed to load user data!")
        }
      } catch (err) {
        setError("Error fetching user data.")
        toast.error("Failed to fetch user data!")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully!")
    navigate("/login")
  }

  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => setUpdateSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [updateSuccess])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setUpdating(true)

    const token = getToken()
    if (!token || !user) {
      setError("You must be logged in to update your profile.")
      toast.error("Authentication required!")
      setUpdating(false)
      return
    }

    const updatedData = {
      Bio: bio,
      Phone: phone,
      Email: email,
      UserName: userName,
    }

    try {
      const response = await axios.put(`https://localhost:7186/api/Tblusers/${user.UserId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 204) {
        setUpdateSuccess(true)
        setUser((prev) => ({
          ...prev,
          ...updatedData,
        }))
        setShowModal(false)
        setError(null)
        toast.success("Profile updated successfully!")
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.")
      toast.error("Failed to update profile!")
    } finally {
      setUpdating(false)
    }
  }

  const getRoleDisplay = (roleId) => {
    switch (roleId) {
      case 1:
        return "Administrator"
      case 2:
        return "Game Zone Owner"
      case 3:
        return "Player"
      default:
        return "User"
    }
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => {
    if (window.innerWidth < 992) {
      setSidebarOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="gamezone-layout">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(26, 26, 26, 0.9)",
              color: "#ffffff",
              border: "1px solid rgba(255, 215, 0, 0.3)",
              borderRadius: "12px",
              backdropFilter: "blur(20px)",
            },
          }}
        />

        {/* Animated Background */}
        <div className="layout-background">
          <div className="grid-overlay"></div>
          <div className="floating-particles">
            <div className="particle particle-0"></div>
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
          </div>
        </div>

        <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />

        <div className={`main-content ${sidebarOpen && window.innerWidth >= 992 ? "sidebar-open" : "sidebar-closed"}`}>
          <DashboardHeader toggleSidebar={toggleSidebar} />
          <main className="content-area">
            <div className="content-wrapper">
              <div className="loading-container">
                <div className="loading-spinner">
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                </div>
                <p className="loading-text">Loading your profile...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="gamezone-layout">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(26, 26, 26, 0.9)",
              color: "#ffffff",
              border: "1px solid rgba(255, 215, 0, 0.3)",
              borderRadius: "12px",
              backdropFilter: "blur(20px)",
            },
          }}
        />

        {/* Animated Background */}
        <div className="layout-background">
          <div className="grid-overlay"></div>
          <div className="floating-particles">
            <div className="particle particle-0"></div>
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
          </div>
        </div>

        <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />

        <div className={`main-content ${sidebarOpen && window.innerWidth >= 992 ? "sidebar-open" : "sidebar-closed"}`}>
          <DashboardHeader toggleSidebar={toggleSidebar} />
          <main className="content-area">
            <div className="content-wrapper">
              <div className="error-container">
                <FaExclamationTriangle className="error-icon" />
                <h2 className="error-title">Error Loading Profile</h2>
                <p className="error-message">{error}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="gamezone-layout">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(26, 26, 26, 0.9)",
              color: "#ffffff",
              border: "1px solid rgba(255, 215, 0, 0.3)",
              borderRadius: "12px",
              backdropFilter: "blur(20px)",
            },
          }}
        />

        {/* Animated Background */}
        <div className="layout-background">
          <div className="grid-overlay"></div>
          <div className="floating-particles">
            <div className="particle particle-0"></div>
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
          </div>
        </div>

        <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />

        <div className={`main-content ${sidebarOpen && window.innerWidth >= 992 ? "sidebar-open" : "sidebar-closed"}`}>
          <DashboardHeader toggleSidebar={toggleSidebar} />
          <main className="content-area">
            <div className="content-wrapper">
              <div className="error-container">
                <FaUser className="error-icon" />
                <h2 className="error-title">No User Data</h2>
                <p className="error-message">Unable to load user information.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="gamezone-layout">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(26, 26, 26, 0.9)",
            color: "#ffffff",
            border: "1px solid rgba(255, 215, 0, 0.3)",
            borderRadius: "12px",
            backdropFilter: "blur(20px)",
          },
        }}
      />

      {/* Animated Background */}
      <div className="layout-background">
        <div className="grid-overlay"></div>
        <div className="floating-particles">
          <div className="particle particle-0"></div>
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />

      <div className={`main-content ${sidebarOpen && window.innerWidth >= 992 ? "sidebar-open" : "sidebar-closed"}`}>
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <main className="content-area">
          <div className="content-wrapper">
            {/* Header Section */}
            <div className="dashboard-header">
              <div className="header-content">
                <div>
                  <h1 className="dashboard-title">
                    <User className="title-icon" />
                    Profile Management
                  </h1>
                  <p className="dashboard-subtitle">Manage your account information and preferences</p>
                </div>
                <div className="system-status">
                  <div className="status-indicator active"></div>
                  <span>Account Active</span>
                </div>
              </div>
            </div>

            {/* Enhanced Profile Panel */}
            <div className="panel enhanced-profile-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <Shield className="panel-icon" />
                  Account Information
                </div>
                <div className="profile-badges">
                  <div className="profile-badge">
                    <Settings size={14} />
                    <span>Verified Account</span>
                  </div>
                  <div className="profile-badge">
                    <Shield size={14} />
                    <span>Secure Profile</span>
                  </div>
                </div>
              </div>

              <div className="panel-content">
                <div className="enhanced-profile-container">
                  {/* Profile Avatar Section */}
                  <div className="profile-avatar-section">
                    <div className="profile-avatar-large">
                      <div className="avatar-ring"></div>
                      <div className="avatar-content">{getInitials(user.UserName || "User")}</div>
                      <div className="avatar-glow"></div>
                    </div>
                    <div className="profile-info">
                      <h2 className="profile-name">{user.UserName || "Unknown User"}</h2>
                      <div className="profile-role">
                        <FaUserTag />
                        {getRoleDisplay(user.RoleId)}
                      </div>
                      <div className="profile-status">
                        <div className="status-dot"></div>
                        Active Account
                      </div>
                    </div>
                  </div>

                  {/* Profile Details Grid */}
                  <div className="profile-details-grid">
                    <div className="detail-item">
                      <div className="detail-header">
                        <div className="detail-icon">
                          <User size={20} />
                        </div>
                        <span className="detail-label">Username</span>
                      </div>
                      <div className="detail-value">{user.UserName || "Not provided"}</div>
                      <div className="detail-border"></div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-header">
                        <div className="detail-icon">
                          <Mail size={20} />
                        </div>
                        <span className="detail-label">Email Address</span>
                      </div>
                      <div className="detail-value">{user.sub || "Not provided"}</div>
                      <div className="detail-border"></div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-header">
                        <div className="detail-icon">
                          <Phone size={20} />
                        </div>
                        <span className="detail-label">Phone Number</span>
                      </div>
                      <div className="detail-value">{user.Phone || "Not provided"}</div>
                      <div className="detail-border"></div>
                    </div>

                    <div className="detail-item full-width">
                      <div className="detail-header">
                        <div className="detail-icon">
                          <FileText size={20} />
                        </div>
                        <span className="detail-label">Biography</span>
                      </div>
                      <div className="detail-value bio-value">{user.Bio || "No bio available"}</div>
                      <div className="detail-border"></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="profile-actions">
                    <button className="enhanced-btn primary" onClick={() => setShowModal(true)}>
                      <Edit3 size={16} />
                      Update Profile
                    </button>
                    <button className="enhanced-btn secondary" onClick={handleLogout}>
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Enhanced Update Modal */}
      {showModal && (
        <div className="enhanced-modal-overlay">
          <div className="enhanced-modal">
            <div className="enhanced-modal-header">
              <h3 className="enhanced-modal-title">
                <Edit3 size={20} />
                Update Profile Information
              </h3>
              <button className="enhanced-modal-close" onClick={() => setShowModal(false)} disabled={updating}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="enhanced-modal-form">
              <div className="enhanced-form-grid">
                <div className="enhanced-form-group">
                  <label className="enhanced-form-label">
                    <User size={16} />
                    <span>Username</span>
                    <span className="required">*</span>
                  </label>
                  <div className="input-container">
                    <input
                      type="text"
                      className="enhanced-input"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Your username"
                      disabled={updating}
                      required
                    />
                    <div className="input-border"></div>
                  </div>
                </div>

                <div className="enhanced-form-group">
                  <label className="enhanced-form-label">
                    <Mail size={16} />
                    <span>Email Address</span>
                    <span className="required">*</span>
                  </label>
                  <div className="input-container">
                    <input
                      type="email"
                      className="enhanced-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      disabled={updating}
                      required
                    />
                    <div className="input-border"></div>
                  </div>
                </div>

                <div className="enhanced-form-group">
                  <label className="enhanced-form-label">
                    <Phone size={16} />
                    <span>Phone Number</span>
                  </label>
                  <div className="input-container">
                    <input
                      type="tel"
                      className="enhanced-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Your phone number"
                      disabled={updating}
                    />
                    <div className="input-border"></div>
                  </div>
                </div>

                <div className="enhanced-form-group full-width">
                  <label className="enhanced-form-label">
                    <FileText size={16} />
                    <span>Biography</span>
                  </label>
                  <div className="input-container">
                    <textarea
                      className="enhanced-input enhanced-textarea"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      disabled={updating}
                      rows={4}
                    />
                    <div className="input-border"></div>
                  </div>
                </div>
              </div>

              <div className="enhanced-modal-actions">
                <button
                  type="button"
                  className="enhanced-btn secondary"
                  onClick={() => setShowModal(false)}
                  disabled={updating}
                >
                  <X size={16} />
                  Cancel
                </button>
                <button type="submit" className="enhanced-btn primary" disabled={updating}>
                  {updating ? (
                    <>
                      <div className="btn-spinner"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {updateSuccess && (
        <div className="enhanced-success-notification">
          <FaCheck className="success-icon" />
          <div className="success-content">Profile updated successfully!</div>
        </div>
      )}
    </div>
  )
}

export default OwnerViewProfile

