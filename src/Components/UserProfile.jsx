// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { getToken, getUserInfo, logout } from '../auth/JwtUtils'; // Import logout function
// import '../css/UserProfile.css';
// import Navbar from './Navbar';

// const UserProfile = () => {
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


//    useEffect(() => {
//       if (updateSuccess) {
//         const timer = setTimeout(() => setUpdateSuccess(false), 3000);
//         return () => clearTimeout(timer);
//       }
//     }, [updateSuccess]);
    
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
//       <Navbar />
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
//           <strong>Role:</strong> {user.RoleId == 1 ? 'Admin' : user.RoleId == 2 ? 'GameZoneOwner' : 'User'}
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

// export default UserProfile;


import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { getToken, getUserInfo, logout } from "../auth/JwtUtils"
import "../css/UserProfile.css"
import Navbar from "./Navbar"
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaEdit,
  FaSave,
  FaTimes,
  FaSignOutAlt,
  FaUserCircle,
  FaInfoCircle,
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
  FaUserTag,
  FaCrown,
  FaGamepad,
  FaShieldAlt,
} from "react-icons/fa"

const UserProfile = () => {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [bio, setBio] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const token = getToken()
        if (!token) {
          setError("No token found. Please log in.")
          navigate("/login")
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
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])

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
    setIsUpdating(true)

    const token = getToken()
    if (!token || !user) {
      setError("You must be logged in to update your profile.")
      setIsUpdating(false)
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
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const getRoleInfo = (roleId) => {
    switch (roleId) {
      case 1:
        return { name: "Admin", icon: <FaShieldAlt />, color: "#ef4444" }
      case 2:
        return { name: "GameZone Owner", icon: <FaCrown />, color: "#8b5cf6" }
      default:
        return { name: "User", icon: <FaGamepad />, color: "#10b981" }
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="profile-page">
          <div className="loading-container">
            <div className="loading-spinner">
              <FaSpinner className="spinner" />
            </div>
            <p>Loading your profile...</p>
          </div>
        </div>
      </>
    )
  }

  if (error && !user) {
    return (
      <>
        <Navbar />
        <div className="profile-page">
          <div className="error-container">
            <div className="error-icon">
              <FaExclamationTriangle />
            </div>
            <h2>Error Loading Profile</h2>
            <p>{error}</p>
            <button className="golden-btn" onClick={() => navigate("/login")}>
              Go to Login
            </button>
          </div>
        </div>
      </>
    )
  }

  const roleInfo = getRoleInfo(user?.RoleId)

  return (
    <>
      <Navbar />
      <div className="profile-page">
        {/* Background Effects */}
        <div className="profile-bg-overlay"></div>
        <div className="profile-bg-pattern"></div>
        <div className="profile-floating-elements">
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
        </div>  

        {/* Profile Container */}
        <div className="profile-container">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="header-content">
              <div className="profile-avatar">
                <FaUserCircle />
              </div>
              <div className="header-info">
                <h1 className="profile-title">My Profile</h1>
                <p className="profile-subtitle">Manage your account information and preferences</p>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>

          {/* Success Message */}
          {updateSuccess && (
            <div className="success-message">
              <FaCheck className="success-icon" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <FaExclamationTriangle className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          {/* Profile Details Card */}
          <div className="profile-details-card">
            <div className="card-header">
              <h2 className="card-title">
                <FaUser className="card-icon" />
                Profile Information
              </h2>
              <button className="edit-btn" onClick={() => setShowModal(true)}>
                <FaEdit />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="profile-info-grid">
              <div className="info-item">
                <div className="info-label">
                  <FaUser className="info-icon" />
                  <span>Username</span>
                </div>
                <div className="info-value">{user?.UserName || "Not provided"}</div>
              </div>

              <div className="info-item">
                <div className="info-label">
                  <FaEnvelope className="info-icon" />
                  <span>Email</span>
                </div>
                <div className="info-value">{user?.sub || "Not provided"}</div>
              </div>

              <div className="info-item">
                <div className="info-label">
                  <FaPhone className="info-icon" />
                  <span>Phone</span>
                </div>
                <div className="info-value">{user?.Phone || "Not provided"}</div>
              </div>

              <div className="info-item">
                <div className="info-label">
                  <FaInfoCircle className="info-icon" />
                  <span>Bio</span>
                </div>
                <div className="info-value">{user?.Bio || "No bio available"}</div>
              </div>

              {/* <div className="info-item role-item">
                <div className="info-label">
                  <FaUserTag className="info-icon" />
                  <span>Role</span>
                </div>
                <div className="role-badge" style={{ "--role-color": roleInfo.color }}>
                  {roleInfo.icon}
                  <span>{roleInfo.name}</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Update Profile Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  <FaEdit className="modal-icon" />
                  Update Profile
                </h2>
                <button className="close-modal" onClick={() => setShowModal(false)}>
                  <FaTimes />
                </button>
              </div>

              <div className="modal-content">
                <form onSubmit={handleUpdate} className="update-form">
                  <div className="form-group">
                    <label className="form-label">
                      <FaUser className="label-icon" />
                      Username
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your username"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaEnvelope className="label-icon" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaPhone className="label-icon" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaInfoCircle className="label-icon" />
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself"
                      className="form-textarea"
                      rows="3"
                    />
                  </div>

                  <div className="modal-actions">
                    <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                    <button type="submit" className="save-btn" disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <FaSpinner className="spinner" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <FaSave />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default UserProfile
