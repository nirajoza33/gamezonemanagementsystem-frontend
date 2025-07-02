// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { getUserInfo } from '../auth/JwtUtils'; // Import your function to get logged-in user info
// import Navbar from './Navbar';


// const ChangePassword = () => {
//   const navigate = useNavigate();

//   // Get the logged-in user's info (including userId)
//   const userInfo = getUserInfo();
//   const userId = userInfo?.UserId;  // Assuming `userId` is part of the user info

//   // State variables for form inputs and error/success messages
//   const [oldPassword, setOldPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate if new password and confirm password match
//     if (newPassword !== confirmPassword) {
//       setError("New password and confirmation password do not match.");
//       return;
//     }

//     if (!userId) {
//       setError("User is not authenticated.");
//       return;
//     }

//     try {
//       const response = await axios.post('https://localhost:7186/api/Tblusers/change-password', {
//         userId: userId,    // Send the dynamic userId here
//         oldPassword: oldPassword,
//         newPassword: newPassword
//       });

//       if (response.data.success) {
//         setSuccessMessage(response.data.message);
//         setError('');
//         // You can redirect the user to the profile page or login page after success
//         setTimeout(() => {
//           navigate('/'); // Redirect to the profile page
//         }, 2000);
//       }
//     } catch (error) {
//       setError(error.response?.data?.message || "An error occurred while changing the password.");
//       setSuccessMessage('');
//     }
//   };

//   return (
//     <>
//     <Navbar/>
//     <div className="change-password-container" 
    
//     style={{
//         height: '100vh',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         flexDirection: 'column',
//         backgroundColor: '#000', // optional: to make white text visible
//         color: 'white',
//         textAlign: 'center'
//       }}>
//       <h2>Change Password</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="oldPassword">Old Password</label>
//           <input
//             type="password"
//             id="oldPassword"
//             value={oldPassword}
//             onChange={(e) => setOldPassword(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="newPassword">New Password</label>
//           <input
//             type="password"
//             id="newPassword"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="confirmPassword">Confirm New Password</label>
//           <input
//             type="password"
//             id="confirmPassword"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </div>

//         {error && <p className="error-message">{error}</p>}
//         {successMessage && <p className="success-message">{successMessage}</p>}

//         <button type="submit" className="submit-btn">Change Password</button>
//       </form>
//     </div>
//     </>
//   );
// };

// export default ChangePassword;

"use client"

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getUserInfo, getToken } from '../auth/JwtUtils'
import Navbar from './Navbar'
import '../css/ChangedPassword.css'
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaSpinner,
  FaShieldAlt,
  FaArrowLeft,
  FaCheckCircle
} from 'react-icons/fa'

const ChangePassword = () => {
  const navigate = useNavigate()
  const userInfo = getUserInfo()
  const userId = userInfo?.UserId

  // State variables
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  // Password requirements
  const requirements = [
    { id: 1, text: 'At least 8 characters', regex: /.{8,}/ },
    { id: 2, text: 'At least one uppercase letter', regex: /[A-Z]/ },
    { id: 3, text: 'At least one lowercase letter', regex: /[a-z]/ },
    { id: 4, text: 'At least one number', regex: /[0-9]/ },
    { id: 5, text: 'At least one special character', regex: /[^A-Za-z0-9]/ }
  ]

  // Check password strength
  useEffect(() => {
    if (newPassword) {
      let strength = 0
      requirements.forEach(req => {
        if (req.regex.test(newPassword)) strength++
      })
      setPasswordStrength(strength)
    } else {
      setPasswordStrength(0)
    }
  }, [newPassword])

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation password do not match.")
      return
    }

    if (!userId) {
      setError("User is not authenticated.")
      return
    }

    // Check if password meets all requirements
    const meetsAllRequirements = requirements.every(req => req.regex.test(newPassword))
    if (!meetsAllRequirements) {
      setError("New password doesn't meet all requirements.")
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const token = getToken()
      const response = await axios.post('https://localhost:7186/api/Tblusers/change-password', {
        userId: userId,
        oldPassword: oldPassword,
        newPassword: newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.success) {
        setSuccessMessage(response.data.message || "Password changed successfully!")
        setShowSuccessPopup(true)
        
        // Reset form
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        
        // Redirect after showing success popup
        setTimeout(() => {
          navigate('/')
        }, 3000)
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred while changing the password.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="change-password-page">
        {/* Background Effects */}
        <div className="password-bg-overlay"></div>
        <div className="password-bg-pattern"></div>
        <div className="password-floating-elements">
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
        </div>

        <div className="change-password-container">
          <div className="back-button" onClick={() => navigate('/')}>
            <FaArrowLeft /> <span>Back to Profile</span>
          </div>

          <div className="change-password-card">
            <div className="card-header">
              <div className="header-icon">
                <FaShieldAlt />
              </div>
              <h2>Change Password</h2>
              <p>Update your password to keep your account secure</p>
            </div>

            {error && (
              <div className="error-message">
                <FaExclamationTriangle className="error-icon" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="oldPassword">
                  <FaLock className="input-icon" />
                  Current Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    id="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    placeholder="Enter your current password"
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    aria-label={showOldPassword ? "Hide password" : "Show password"}
                  >
                    {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">
                  <FaLock className="input-icon" />
                  New Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter your new password"
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Password strength indicator */}
                {newPassword && (
                  <div className="password-strength">
                    <div className="strength-text">
                      Password Strength: 
                      <span className={`strength-level strength-${passwordStrength}`}>
                        {passwordStrength === 0 && "Very Weak"}
                        {passwordStrength === 1 && "Weak"}
                        {passwordStrength === 2 && "Fair"}
                        {passwordStrength === 3 && "Good"}
                        {passwordStrength === 4 && "Strong"}
                        {passwordStrength === 5 && "Very Strong"}
                      </span>
                    </div>
                    <div className="strength-meter">
                      {[...Array(5)].map((_, index) => (
                        <div 
                          key={index} 
                          className={`strength-segment ${index < passwordStrength ? 'active' : ''}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Password requirements */}
                {newPassword && (
                  <div className="password-requirements">
                    <p className="requirements-title">Password must have:</p>
                    <ul className="requirements-list">
                      {requirements.map(req => (
                        <li 
                          key={req.id} 
                          className={req.regex.test(newPassword) ? 'met' : 'not-met'}
                        >
                          {req.regex.test(newPassword) ? <FaCheck /> : <FaTimes />}
                          <span>{req.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <FaLock className="input-icon" />
                  Confirm New Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm your new password"
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {confirmPassword && newPassword && (
                  <div className={`password-match ${confirmPassword === newPassword ? 'match' : 'no-match'}`}>
                    {confirmPassword === newPassword ? (
                      <>
                        <FaCheck /> Passwords match
                      </>
                    ) : (
                      <>
                        <FaTimes /> Passwords do not match
                      </>
                    )}
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className="submit-btn" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="spinner" />
                    Changing Password...
                  </>
                ) : (
                  'Change Password'
                )}
              </button>
            </form>

            <div className="security-info">
              <FaShieldAlt className="security-icon" />
              <p>
                For security reasons, you'll be logged out after changing your password.
                You'll need to log in again with your new password.
              </p>
            </div>
          </div>
        </div>

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="success-popup-overlay">
            <div className="success-popup">
              <div className="success-icon">
                <FaCheckCircle />
              </div>
              <h3>Password Changed Successfully!</h3>
              <p>{successMessage}</p>
              <p className="redirect-message">Redirecting to your profile...</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ChangePassword
