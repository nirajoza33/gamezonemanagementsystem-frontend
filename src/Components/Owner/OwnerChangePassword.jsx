// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { getUserInfo } from '../../auth/JwtUtils'; // Import your function to get logged-in user info
// import OwnerNavbar from './OwnerNavbar';

// const OwnerChangePassword = () => {
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
//           navigate('/GameZoneOwner/dashboard'); // Redirect to the profile page
//         }, 2000);
//       }
//     } catch (error) {
//       setError(error.response?.data?.message || "An error occurred while changing the password.");
//       setSuccessMessage('');
//     }
//   };

//   return (
//     <>
//     <OwnerNavbar/>
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

// export default OwnerChangePassword;


import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Lock, Eye, EyeOff, Shield, Key, X, Save, CheckCircle, AlertCircle, Zap, Timer, Fingerprint, RefreshCw } from 'lucide-react'
import { getUserInfo } from '../../auth/JwtUtils'
import Sidebar from './Sidebar'
import DashboardHeader from './DashboardHeader'
import toast, { Toaster } from 'react-hot-toast'
import './OwnerChangePassword.css'

const OwnerChangePassword = () => {
  const navigate = useNavigate()
  const userInfo = getUserInfo()
  const userId = userInfo?.UserId

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Enhanced validation states
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [validationResults, setValidationResults] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    match: false,
    different: false,
  })

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    Object.values(checks).forEach((check) => {
      if (check) strength += 20
    })

    return { strength, checks }
  }

  // Real-time password validation
  useEffect(() => {
    if (newPassword) {
      setIsTyping(true)
      const timer = setTimeout(() => setIsTyping(false), 500)

      const { strength, checks } = calculatePasswordStrength(newPassword)
      setPasswordStrength(strength)

      // Update validation results
      setValidationResults({
        ...checks,
        match: confirmPassword ? newPassword === confirmPassword : false,
        different: oldPassword ? newPassword !== oldPassword : false,
      })

      // Password feedback
      if (strength < 40) {
        setPasswordFeedback('Weak - Add more complexity')
      } else if (strength < 80) {
        setPasswordFeedback('Good - Almost there!')
      } else {
        setPasswordFeedback('Strong - Excellent security!')
      }

      return () => clearTimeout(timer)
    } else {
      setPasswordStrength(0)
      setPasswordFeedback('')
      setValidationResults({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
        match: false,
        different: false,
      })
    }
  }, [newPassword, confirmPassword, oldPassword])

  const getStrengthColor = () => {
    if (passwordStrength < 40) return '#ef4444'
    if (passwordStrength < 80) return '#f59e0b'
    return '#10b981'
  }

  const getStrengthText = () => {
    if (passwordStrength < 40) return 'Weak'
    if (passwordStrength < 80) return 'Good'
    return 'Strong'
  }

  const generateStrongPassword = () => {
    const length = 12
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let password = ''

    // Ensure at least one of each required character type
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
    password += '0123456789'[Math.floor(Math.random() * 10)]
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)]

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)]
    }

    // Shuffle the password
    password = password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('')

    setNewPassword(password)
    setShowNewPassword(true)
    toast.success('Strong password generated!')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    // Enhanced validation
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation password do not match.')
      toast.error('Passwords do not match!')
      return
    }

    if (passwordStrength < 60) {
      setError('Password is too weak. Please choose a stronger password.')
      toast.error('Password too weak!')
      return
    }

    if (newPassword === oldPassword) {
      setError('New password must be different from your current password.')
      toast.error('Password must be different!')
      return
    }

    if (!userId) {
      setError('User is not authenticated.')
      toast.error('Authentication error!')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post('https://localhost:7186/api/Tblusers/change-password', {
        userId: userId,
        oldPassword: oldPassword,
        newPassword: newPassword,
      })

      if (response.data.success) {
        setSuccessMessage(response.data.message)
        setError('')
        toast.success('Password changed successfully!')

        // Clear form
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')

        setTimeout(() => {
          navigate('/GameZoneOwner/dashboard')
        }, 2000)
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'An error occurred while changing the password.'
      setError(errorMsg)
      setSuccessMessage('')
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => {
    if (window.innerWidth < 992) {
      setSidebarOpen(false)
    }
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
                    <Shield className="title-icon" />
                    Security Center
                  </h1>
                  <p className="dashboard-subtitle">Advanced password management with real-time security validation</p>
                </div>
                <div className="system-status">
                  <div className="status-indicator active"></div>
                  <span>Secure Connection</span>
                </div>
              </div>
            </div>

            {/* Enhanced Change Password Panel */}
            <div className="panel enhanced-password-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <Fingerprint className="panel-icon" />
                  Password Security
                </div>
                <div className="security-badges">
                  <div className="security-badge">
                    <Shield size={14} />
                    <span>256-bit Encryption</span>
                  </div>
                  <div className="security-badge">
                    <Timer size={14} />
                    <span>Real-time Validation</span>
                  </div>
                </div>
              </div>

              <div className="panel-content">
                <div className="enhanced-password-container">
                  {/* Security Dashboard */}
                  <div className="security-dashboard">
                    <div className="security-header">
                      <div className="security-icon-large">
                        <Key size={40} />
                        <div className="icon-pulse"></div>
                      </div>
                      <h3>Password Security</h3>
                      <p>Create a strong, unique password to protect your account from unauthorized access.</p>
                    </div>

                    {/* Password Strength Meter */}
                    {newPassword && (
                      <div className="strength-meter-container">
                        <div className="strength-header">
                          <span className="strength-label">Password Strength</span>
                          <span className="strength-text" style={{ color: getStrengthColor() }}>
                            {getStrengthText()}
                          </span>
                        </div>
                        <div className="strength-meter">
                          <div
                            className="strength-fill"
                            style={{
                              width: `${passwordStrength}%`,
                              backgroundColor: getStrengthColor(),
                            }}
                          ></div>
                        </div>
                        <div className="strength-feedback">
                          {isTyping ? (
                            <div className="typing-indicator">
                              <div className="typing-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                              <span>Analyzing...</span>
                            </div>
                          ) : (
                            <span style={{ color: getStrengthColor() }}>{passwordFeedback}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Security Tips */}
                    <div className="security-tips">
                      <h4>
                        <Zap size={16} />
                        Security Tips
                      </h4>
                      <ul>
                        <li>Use a unique password for this account</li>
                        <li>Include a mix of letters, numbers, and symbols</li>
                        <li>Avoid personal information or common words</li>
                        <li>Consider using a password manager</li>
                      </ul>
                    </div>
                  </div>

                  {/* Enhanced Form */}
                  <div className="enhanced-form-section">
                    <form onSubmit={handleSubmit} className="enhanced-password-form">
                      <div className="form-section">
                        <h3 className="section-title">
                          <Lock size={16} />
                          Change Password
                        </h3>

                        <div className="enhanced-form-grid">
                          {/* Current Password */}
                          <div className="enhanced-form-group full-width">
                            <label className="enhanced-form-label">
                              <Lock size={16} />
                              <span>Current Password</span>
                              <span className="required">*</span>
                            </label>
                            <div className="input-container password-input-container">
                              <input
                                type={showOldPassword ? "text" : "password"}
                                className="enhanced-input password-input"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="Enter your current password"
                                required
                              />
                              <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                              >
                                {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                              <div className="input-border"></div>
                            </div>
                          </div>

                          {/* New Password */}
                          <div className="enhanced-form-group full-width">
                            <label className="enhanced-form-label">
                              <Key size={16} />
                              <span>New Password</span>
                              <span className="required">*</span>
                            </label>
                            <div className="input-container password-input-container">
                              <input
                                type={showNewPassword ? "text" : "password"}
                                className="enhanced-input password-input"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter your new password"
                                required
                              />
                              <div className="password-actions">
                                <button
                                  type="button"
                                  className="password-generate"
                                  onClick={generateStrongPassword}
                                  title="Generate strong password"
                                >
                                  <RefreshCw size={14} />
                                </button>
                                <button
                                  type="button"
                                  className="password-toggle"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                              </div>
                              <div className="input-border"></div>
                            </div>
                          </div>

                          {/* Confirm Password */}
                          <div className="enhanced-form-group full-width">
                            <label className="enhanced-form-label">
                              <Shield size={16} />
                              <span>Confirm New Password</span>
                              <span className="required">*</span>
                            </label>
                            <div className="input-container password-input-container">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="enhanced-input password-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your new password"
                                required
                              />
                              <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                              <div className="input-border"></div>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Password Requirements */}
                        <div className="enhanced-requirements">
                          <h4>Password Requirements</h4>
                          <div className="requirements-grid">
                            <div className={`requirement-item ${validationResults.length ? "met" : ""}`}>
                              {validationResults.length ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                              <span>At least 8 characters</span>
                            </div>
                            <div className={`requirement-item ${validationResults.uppercase ? "met" : ""}`}>
                              {validationResults.uppercase ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                              <span>One uppercase letter</span>
                            </div>
                            <div className={`requirement-item ${validationResults.lowercase ? "met" : ""}`}>
                              {validationResults.lowercase ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                              <span>One lowercase letter</span>
                            </div>
                            <div className={`requirement-item ${validationResults.number ? "met" : ""}`}>
                              {validationResults.number ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                              <span>One number</span>
                            </div>
                            <div className={`requirement-item ${validationResults.special ? "met" : ""}`}>
                              {validationResults.special ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                              <span>One special character</span>
                            </div>
                            <div className={`requirement-item ${validationResults.match ? "met" : ""}`}>
                              {validationResults.match ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                              <span>Passwords match</span>
                            </div>
                            <div className={`requirement-item ${validationResults.different ? "met" : ""}`}>
                              {validationResults.different ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                              <span>Different from current</span>
                            </div>
                          </div>
                        </div>

                        {/* Error and Success Messages */}
                        {error && (
                          <div className="enhanced-error-message">
                            <AlertCircle size={20} />
                            <div>
                              <strong>Error</strong>
                              <p>{error}</p>
                            </div>
                          </div>
                        )}

                        {successMessage && (
                          <div className="enhanced-success-message">
                            <CheckCircle size={20} />
                            <div>
                              <strong>Success</strong>
                              <p>{successMessage}</p>
                            </div>
                          </div>
                        )}

                        {/* Enhanced Form Actions */}
                        <div className="enhanced-form-actions">
                          <button
                            type="button"
                            className="enhanced-btn secondary"
                            onClick={() => navigate("/GameZoneOwner/dashboard")}
                          >
                            <X size={16} />
                            Cancel
                          </button>

                          <button type="submit" className="enhanced-btn primary" disabled={loading || passwordStrength < 60}>
                            {loading ? (
                              <>
                                <div className="btn-spinner"></div>
                                Updating Password...
                              </>
                            ) : (
                              <>
                                <Save size={16} />
                                Update Password
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default OwnerChangePassword
