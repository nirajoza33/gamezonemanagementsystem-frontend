// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';
// // import { getToken, getUserInfo, logout } from '../../auth/JwtUtils'; // Import logout function
// // import '../../css/UserProfile.css';

// // const AdminViewProfile = () => {
// //     const [user, setUser] = useState(null);
// //     const [error, setError] = useState(null);
// //     const [bio, setBio] = useState('');
// //     const [phone, setPhone] = useState('');
// //     const [email, setEmail] = useState('');
// //     const [userName, setUserName] = useState('');
// //     const [updateSuccess, setUpdateSuccess] = useState(false);
// //     const [showModal, setShowModal] = useState(false); // To control the visibility of the modal
// //     const navigate = useNavigate();

// //     useEffect(() => {
// //       // Fetch user data when the component is mounted
// //       const fetchUserData = async () => {
// //         try {
// //           const token = getToken(); // Get token from session or localStorage
// //           if (!token) {
// //             setError("No token found. Please log in.");
// //             return;
// //           }

// //           const userInfo = getUserInfo(); // Decode the JWT to get user info
// //           if (userInfo) {
// //             setUser(userInfo); // Set user info in the state
// //             setBio(userInfo.Bio || '');
// //             setPhone(userInfo.Phone || '');
// //             setEmail(userInfo.sub || '');
// //             setUserName(userInfo.UserName || '');
// //           } else {
// //             setError("Error: No valid user data.");
// //           }
// //         } catch (err) {
// //           setError("Error fetching user data.");
// //         }
// //       };

// //       fetchUserData();
// //     }, []);

// //     const handleLogout = () => {
// //       logout(); // Calls logout function from jwtUtils.js
// //       navigate('/login');
// //     };

// //     const handleUpdate = async (e) => {
// //         e.preventDefault(); // Prevent form submission
// //         const token = getToken();
// //         if (!token) {
// //           setError("You must be logged in to update your profile.");
// //           return;
// //         }

// //         try {
// //           const userId = user.UserId; // Get user ID
// //           const updatedData = {
// //             Bio: bio,
// //             Phone: phone,
// //             Email: email,
// //             UserName: userName,
// //           };

// //           const response = await axios.put(
// //             `https://localhost:7186/api/Tblusers/${userId}`, // Replace with your API URL
// //             updatedData,
// //             {
// //               headers: {
// //                 Authorization: `Bearer ${token}`,
// //               },
// //             }
// //           );

// //           if (response.status === 200) {
// //             setUpdateSuccess(true); // Indicate the update was successful
// //             setUser((prevState) => ({
// //               ...prevState,
// //               Bio: bio,
// //               Phone: phone,
// //               Email: email,
// //               UserName: userName,
// //             }));
// //             setShowModal(false); // Close the modal after saving
// //           }
// //         } catch (err) {
// //           setError("Error updating profile.");
// //         }
// //     };

// //     if (error) {
// //       return <div className="error-message">{error}</div>;
// //     }

// //     if (!user) {
// //       return <div>Loading...</div>;
// //     }

// //     return (
// //       <div className="profile-page">

// //         <h2>Profile Information</h2>
// //         <div className="profile-details">
// //           <div>
// //             <strong>Username:</strong> {user.UserName}
// //           </div>
// //           <div>
// //             <strong>Email:</strong> {user.sub}
// //           </div>
// //           <div>
// //             <strong>Phone:</strong> {user.Phone}
// //           </div>
// //           <div>
// //             <strong>Bio:</strong> {user.Bio || 'No bio available.'}
// //           </div>
// //           <div>
// //             <strong>Role:</strong> {user.RoleId == 1 ? 'Admin' : user.RoleId == 2 ? 'GameZoneOwner' : `User`}
// //           </div>
// //         </div>

// //         {/* Update Button */}
// //         <button onClick={() => setShowModal(true)}>Update Profile</button>

// //         {/* Modal for updating profile */}
// //         {showModal && (
// //           <div className="modal">
// //             <div className="modal-content">
// //               <h3>Update Profile</h3>
// //               <form onSubmit={handleUpdate}>
// //                 <div>
// //                   <label>Bio:</label>
// //                   <input
// //                     type="text"
// //                     value={bio}
// //                     onChange={(e) => setBio(e.target.value)}
// //                     placeholder="Update your bio"
// //                   />
// //                 </div>
// //                 <div>
// //                   <label>Phone:</label>
// //                   <input
// //                     type="text"
// //                     value={phone}
// //                     onChange={(e) => setPhone(e.target.value)}
// //                     placeholder="Update your phone number"
// //                   />
// //                 </div>
// //                 <div>
// //                   <label>Email:</label>
// //                   <input
// //                     type="email"
// //                     value={email}
// //                     onChange={(e) => setEmail(e.target.value)}
// //                     placeholder="Update your email"
// //                   />
// //                 </div>
// //                 <div>
// //                   <label>Username:</label>
// //                   <input
// //                     type="text"
// //                     value={userName}
// //                     onChange={(e) => setUserName(e.target.value)}
// //                     placeholder="Update your username"
// //                   />
// //                 </div>
// //                 <button type="submit">Save</button>
// //                 <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
// //               </form>
// //             </div>
// //           </div>
// //         )}

// //         {updateSuccess && <div className="success-message">Profile updated successfully!</div>}
// //       </div>
// //     );
// // };

// // export default AdminViewProfile;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { getToken, getUserInfo, logout } from '../../../auth/JwtUtils';

// const ViewProfile = () => {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState(null);
//   const [bio, setBio] = useState('');
//   const [phone, setPhone] = useState('');
//   const [email, setEmail] = useState('');
//   const [userName, setUserName] = useState('');
//   const [updateSuccess, setUpdateSuccess] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = getToken();
//         if (!token) {
//           setError("No token found. Please log in.");
//           return;
//         }

//         const userInfo = getUserInfo();
//         if (userInfo) {
//           setUser(userInfo);
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
//     logout();
//     navigate('/login');
//   };

//   // const handleUpdate = async (e) => {
//   //   e.preventDefault();
//   //   const token = getToken();
//   //   if (!token) { 
//   //     setError("You must be logged in to update your profile.");
//   //     return;
//   //   }

//   //   try {
//   //     const userId = user.UserId;
//   //     const updatedData = {
//   //       Bio: bio,
//   //       Phone: phone,
//   //       Email: email,
//   //       UserName: userName,
//   //     };

//   //     const response = await axios.put(
//   //       `https://localhost:7186/api/Tblusers/${userId}`,
//   //       updatedData,
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }
//   //     );

//   //     if (response.status === 200) {
//   //       setUpdateSuccess(true);
//   //       setUser((prevState) => ({
//   //         ...prevState,
//   //         Bio: bio,
//   //         Phone: phone,
//   //         Email: email,
//   //         UserName: userName,
//   //       }));
//   //       setShowModal(false);
//   //     }
//   //   } catch (err) {
//   //     setError("Error updating profile.");
//   //   }
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
//     return (
//       <div className="alert alert-danger text-center my-3" role="alert">
//         {error}
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="d-flex justify-content-center align-items-center my-5">
//         <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
//         <span className="visually-hidden">Loading...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="container my-4">
//       <h2 className="mb-4">Profile Information</h2>
//       <div className="card p-3 mb-3">
//         <div className="mb-2 text-white"><strong>Username:</strong> {user.UserName}</div>
//         <div className="mb-2 text-primary"><strong>Email:</strong> {user.sub}</div>
//         <div className="mb-2 text-secondary"><strong>Phone:</strong> {user.Phone}</div>
//         <div className="mb-2 text-white"><strong>Bio:</strong> {user.Bio || 'No bio available.'}</div>
//         <div className="mb-2 text-white">
//           <strong>Role:</strong>{' '}
//           {user.RoleId == 1
//             ? 'Admin'
//             : user.RoleId == 2
//               ? 'GameZoneOwner'
//               : 'User'}
//         </div>
//       </div>

//       <button
//         className="btn btn-primary me-2"
//         onClick={() => setShowModal(true)}
//       >
//         Update Profile
//       </button>
//       <button className="btn btn-secondary" onClick={handleLogout}>
//         Logout
//       </button>

//       {/* Bootstrap Modal */}
//       {showModal && (
//         <div
//           className="modal show d-block"
//           tabIndex="-1"
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="updateProfileLabel"
//           onClick={() => setShowModal(false)}
//         >
//           <div
//             className="modal-dialog"
//             role="document"
//             onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
//           >
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title" id="updateProfileLabel">
//                   Update Profile
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   aria-label="Close"
//                   onClick={() => setShowModal(false)}
//                 ></button>
//               </div>
//               <form onSubmit={handleUpdate}>
//                 <div className="modal-body">
//                   <div className="mb-3">
//                     <label htmlFor="bio" className="form-label">
//                       Bio
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="bio"
//                       value={bio}
//                       onChange={(e) => setBio(e.target.value)}
//                       placeholder="Update your bio"
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="phone" className="form-label">
//                       Phone
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="phone"
//                       value={phone}
//                       onChange={(e) => setPhone(e.target.value)}
//                       placeholder="Update your phone number"
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="email" className="form-label">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       className="form-control"
//                       id="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder="Update your email"
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="username" className="form-label">
//                       Username
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="username"
//                       value={userName}
//                       onChange={(e) => setUserName(e.target.value)}
//                       placeholder="Update your username"
//                     />
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button type="submit" className="btn btn-primary">
//                     Save
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={() => setShowModal(false)}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {updateSuccess && (
//         <div className="alert alert-success mt-3" role="alert">
//           Profile updated successfully!
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewProfile;

"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { getToken, getUserInfo, logout } from "../../../auth/JwtUtils"
import { User, Mail, Phone, Edit, LogOut, X, Save, Shield } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
// import "./css/ViewProfile.css"

const ViewProfile = () => {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [bio, setBio] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getToken()
        if (!token) {
          setError("No token found. Please log in.")
          setLoading(false)
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
        }
      } catch (err) {
        setError("Error fetching user data.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => setUpdateSuccess(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [updateSuccess])

  const handleUpdate = async (e) => {
    e.preventDefault()

    const token = getToken()
    if (!token || !user) {
      setError("You must be logged in to update your profile.")
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
        toast.success("Profile updated successfully!")
      }
    } catch (err) {
      setError("Failed to update profile.")
      toast.error("Failed to update profile.")
    }
  }

  const getRoleDisplay = (roleId) => {
    switch (roleId) {
      case 1:
        return "Admin"
      case 2:
        return "GameZone Owner"
      default:
        return "User"
    }
  }

  const getRoleBadgeClass = (roleId) => {
    switch (roleId) {
      case 1:
        return "role-admin"
      case 2:
        return "role-owner"
      default:
        return "role-user"
    }
  }

  if (loading) {
    return (
      <div className="futuristic-dashboard">
        <div className="dashboard-loading">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <div className="loading-text">Loading profile...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="futuristic-dashboard">
        <div className="error-container">
          <div className="error-content">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="futuristic-dashboard">
        <div className="error-container">
          <div className="error-content">
            <h3>No User Data</h3>
            <p>Unable to load user information.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="futuristic-dashboard">
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
      <div className="dashboard-bg">
        <div className="grid-overlay"></div>
        <div className="floating-particles">
          <div className="particle particle-0"></div>
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
        </div>
      </div>

      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1 className="dashboard-title">
              <User className="title-icon" />
              Profile Information
            </h1>
            <p className="dashboard-subtitle">Manage your account settings and personal information</p>
          </div>
          <div className="system-status">
            <div className="status-indicator active"></div>
            <span>Profile Active</span>
          </div>
        </div>
      </div>

      {/* Profile Panel */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <User className="panel-icon" />
            User Profile
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="panel-action" onClick={() => setShowModal(true)}>
              <Edit size={16} />
              Edit Profile
            </button>
            <button className="panel-action logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        <div className="panel-content">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar">{user.UserName ? user.UserName.charAt(0).toUpperCase() : "U"}</div>
            <div className="profile-info">
              <h4 className="profile-name">
                {user.UserName}
                <Shield size={20} className="verified-icon" />
              </h4>
              <p className="profile-username">@{user.UserName}</p>
              <div className="profile-badges">
                <span className="profile-status active">Active</span>
                <span className={`profile-role ${getRoleBadgeClass(user.RoleId)}`}>{getRoleDisplay(user.RoleId)}</span>
              </div>
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon">
                <Mail size={16} />
              </div>
              <div className="info-content">
                <span className="info-label">Email Address</span>
                <span className="info-value">{user.sub}</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <Phone size={16} />
              </div>
              <div className="info-content">
                <span className="info-label">Phone Number</span>
                <span className="info-value">{user.Phone || "Not provided"}</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <User size={16} />
              </div>
              <div className="info-content">
                <span className="info-label">Bio</span>
                <span className="info-value">{user.Bio || "No bio available"}</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <Shield size={16} />
              </div>
              <div className="info-content">
                <span className="info-label">Account Role</span>
                <span className="info-value">{getRoleDisplay(user.RoleId)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Profile Modal */}
      {showModal && (
        <div className="futuristic-modal-overlay">
          <div className="enhanced-modal">
            {/* Modal Header */}
            <div className="enhanced-modal-header">
              <div className="modal-header-content">
                <div className="modal-icon-wrapper">
                  <Edit className="modal-icon" />
                  <div className="icon-pulse"></div>
                </div>
                <div className="modal-title-section">
                  <h2 className="enhanced-modal-title">Update Profile</h2>
                  <p className="modal-subtitle">Modify your personal information and settings</p>
                </div>
              </div>
              <button type="button" className="enhanced-close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="enhanced-modal-body">
              <form onSubmit={handleUpdate} className="form-container">
                <div className="form-section">
                  <h3 className="section-title">
                    <User size={16} />
                    Personal Information
                  </h3>

                  <div className="enhanced-form-grid">
                    <div className="enhanced-form-group">
                      <label className="enhanced-form-label">
                        <User size={16} />
                        <span>Username</span>
                      </label>
                      <div className="input-container">
                        <input
                          type="text"
                          className="enhanced-input"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Enter your username"
                        />
                        <div className="input-border"></div>
                      </div>
                    </div>

                    <div className="enhanced-form-group">
                      <label className="enhanced-form-label">
                        <Mail size={16} />
                        <span>Email</span>
                      </label>
                      <div className="input-container">
                        <input
                          type="email"
                          className="enhanced-input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                        />
                        <div className="input-border"></div>
                      </div>
                    </div>

                    <div className="enhanced-form-group">
                      <label className="enhanced-form-label">
                        <Phone size={16} />
                        <span>Phone</span>
                      </label>
                      <div className="input-container">
                        <input
                          type="text"
                          className="enhanced-input"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your phone number"
                        />
                        <div className="input-border"></div>
                      </div>
                    </div>

                    <div className="enhanced-form-group full-width">
                      <label className="enhanced-form-label">
                        <User size={16} />
                        <span>Bio</span>
                      </label>
                      <div className="input-container">
                        <input
                          type="text"
                          className="enhanced-input"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Tell us about yourself"
                        />
                        <div className="input-border"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="enhanced-modal-footer">
              <button type="button" className="enhanced-btn secondary" onClick={() => setShowModal(false)}>
                <X size={16} />
                Cancel
              </button>

              <button type="button" className="enhanced-btn primary" onClick={handleUpdate}>
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {updateSuccess && (
        <div className="success-notification">
          <div className="success-content">
            <div className="success-icon">
              <Save size={20} />
            </div>
            <span>Profile updated successfully!</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewProfile
