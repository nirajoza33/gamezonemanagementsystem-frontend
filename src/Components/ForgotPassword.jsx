// import React, { useState } from "react";
// import axios from "axios";
// import Navbar from "./Navbar";

// const ForgotPassword = () => {
//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSendOtp = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("toEmail", email);

//       const res = await axios.post("https://localhost:7186/api/Tblusers/send-forgot-otp", formData, {
//         withCredentials: true, // IMPORTANT for session
//       });

//       setMessage(res.data);
//       setStep(2); // Move to OTP and password step
//     } catch (error) {
//       setMessage(error.response?.data || "Failed to send OTP");
//     }
//   };

//   const handleResetPassword = async () => {
//     try {
//       const res = await axios.post(
//         "https://localhost:7186/api/Tblusers/verify-otp-and-reset-password",
//         {
//           otp,
//           newPassword,
//           confirmPassword,
//         },
//         {
//           withCredentials: true, // Needed for session
//         }
//       );

//       setMessage(res.data.message);
//       setStep(1); // Reset back to step 1 after success
//       setEmail("");
//       setOtp("");
//       setNewPassword("");
//       setConfirmPassword("");
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Error resetting password");
//     }
//   };

//   return (
//     <>
//     <Navbar/>   
//     <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem", marginTop:"50px"}}>
//       <h2>Forgot Password</h2>

//       {step === 1 && (
//         <>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             style={{ display: "block", marginBottom: "1rem", width: "100%" }}
//           />
//           <button onClick={handleSendOtp}>Send OTP</button>
//         </>
//       )}

//       {step === 2 && (
//         <>
//           <input
//             type="text"
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             required
//             style={{ display: "block", marginBottom: "1rem", width: "100%" }}
//           />

//           <input
//             type="password"
//             placeholder="New Password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//             style={{ display: "block", marginBottom: "1rem", width: "100%" }}
//           />

//           <input
//             type="password"
//             placeholder="Confirm Password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//             style={{ display: "block", marginBottom: "1rem", width: "100%" }}
//           />

//           <button onClick={handleResetPassword}>Reset Password</button>
//         </>
//       )}

//       {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
//     </div>
//     </>
//   );
// };

// export default ForgotPassword;

"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import "../css/ForgotPassword.css"
import Navbar from "./Navbar"
import {
  FaEnvelope,
  FaArrowLeft,
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
  FaLock,
  FaShieldAlt,
  FaPaperPlane,
  FaInfoCircle,
  FaKey,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa"

const ForgotPassword = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const navigate = useNavigate()

  // Password strength checker
  const calculateStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    return strength
  }

  const handlePasswordChange = (password) => {
    setNewPassword(password)
    setPasswordStrength(calculateStrength(password))
  }

  const getStrengthLabel = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return "Very Weak"
      case 2:
        return "Weak"
      case 3:
        return "Fair"
      case 4:
        return "Good"
      case 5:
        return "Strong"
      default:
        return "Very Weak"
    }
  }

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return "#ef4444"
      case 2:
        return "#f59e0b"
      case 3:
        return "#eab308"
      case 4:
        return "#22c55e"
      case 5:
        return "#10b981"
      default:
        return "#ef4444"
    }
  }

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setError("Please enter your email address.")
      return
    }

    setIsLoading(true)
    setError("")
    setMessage("")

    try {
      const formData = new FormData()
      formData.append("toEmail", email)

      const res = await axios.post("https://localhost:7186/api/Tblusers/send-forgot-otp", formData, {
        withCredentials: true,
      })

      setMessage(res.data)
      setStep(2)
      setError("")
    } catch (err) {
      setError(err.response?.data || "Failed to send OTP")
      setMessage("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP.")
      return
    }

    if (!newPassword) {
      setError("Please enter a new password.")
      return
    }

    if (passwordStrength < 3) {
      setError("Password is too weak. Please choose a stronger password.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsLoading(true)
    setError("")
    setMessage("")

    try {
      const res = await axios.post(
        "https://localhost:7186/api/Tblusers/verify-otp-and-reset-password",
        {
          otp,
          newPassword,
          confirmPassword,
        },
        {
          withCredentials: true,
        },
      )

      setMessage(res.data.message)
      
      // Reset form and redirect after success
      setTimeout(() => {
        setStep(1)
        setEmail("")
        setOtp("")
        setNewPassword("")
        setConfirmPassword("")
        setMessage("")
        navigate("/login")
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password")
      setMessage("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate("/login")
  }

  const handleBackToStep1 = () => {
    setStep(1)
    setOtp("")
    setNewPassword("")
    setConfirmPassword("")
    setError("")
    setMessage("")
  }

  return (
    <>
      {/* <Navbar /> */}
      <div className="forgot-password-page">
        {/* Background Effects */}
        <div className="forgot-bg-overlay"></div>
        <div className="forgot-bg-pattern"></div>
        <div className="forgot-floating-elements">
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
        </div>

        {/* Main Container */}
        <div className="forgot-password-container">
          {/* Back Button */}
          <button className="back-button" onClick={step === 1 ? handleBackToLogin : handleBackToStep1}>
            <FaArrowLeft />
            <span>{step === 1 ? "Back to Login" : "Back to Email"}</span>
          </button>

          {/* Forgot Password Card */}
          <div className="forgot-password-card">
            {/* Header */}
            <div className="card-header">
              <div className="lock-icon-wrapper">
                <div className="lock-icon">
                  {step === 1 ? <FaLock /> : <FaKey />}
                </div>
                <div className="lock-glow"></div>
              </div>
              <h1 className="card-title">
                {step === 1 ? "Forgot Password?" : "Verify & Reset"}
              </h1>
              {/* <p className="card-subtitle">
                {step === 1
                  ? "Enter your email address and we'll send you an OTP to reset your password."
                  : "Enter the OTP sent to your email and choose a new password."}
              </p> */}
            </div>

            {/* Success Message */}
            {message && (
              <div className="success-message">
                <FaCheck className="success-icon" />
                <span>{message}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <FaExclamationTriangle className="error-icon" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Email Input */}
            {step === 1 && (
              <>
                <div className="forgot-password-form">
                  <div className="form-group">
                    <label className="form-label">
                      <FaEnvelope className="label-icon" />
                      Email Address
                    </label>
                    <div className="input-wrapper">
                      <FaEnvelope className="input-icon" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="form-input"
                        required
                        disabled={isLoading}
                      />
                      <div className="input-glow"></div>
                    </div>
                  </div>

                  <button
                    onClick={handleSendOtp}
                    className="submit-btn"
                    disabled={isLoading || !email.trim()}
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="spinner" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        <span>Send OTP</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Security Info */}
                <div className="security-info">
                  <div className="security-header">
                    <FaShieldAlt className="security-icon" />
                    <h3>Security Information</h3>
                  </div>
                  <ul className="security-list">
                    <li>OTP is valid for 10 minutes only</li>
                    <li>Check your spam folder if you don't receive the email</li>
                    <li>You can request a new OTP if the current one expires</li>
                  </ul>
                </div>

                {/* Footer Links */}
                <div className="card-footer">
                  <p>
                    Remember your password?{" "}
                    <Link to="/login" className="footer-link">
                      Sign in here
                    </Link>
                  </p>
                  <p>
                    Don't have an account?{" "}
                    <Link to="/register" className="footer-link">
                      Create one now
                    </Link>
                  </p>
                </div>
              </>
            )}

            {/* Step 2: OTP and Password Reset */}
            {step === 2 && (
              <>
                <div className="forgot-password-form">
                  <div className="form-group">
                    <label className="form-label">
                      <FaKey className="label-icon" />
                      Enter OTP
                    </label>
                    <div className="input-wrapper">
                      <FaKey className="input-icon" />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        className="form-input"
                        maxLength="6"
                        required
                        disabled={isLoading}
                      />
                      <div className="input-glow"></div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaLock className="label-icon" />
                      New Password
                    </label>
                    <div className="input-wrapper">
                      <FaLock className="input-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        placeholder="Enter new password"
                        className="form-input"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <div className="input-glow"></div>
                    </div>
                    {newPassword && (
                      <div className="password-strength">
                        <div className="strength-bar">
                          <div
                            className="strength-fill"
                            style={{
                              width: `${(passwordStrength / 5) * 100}%`,
                              backgroundColor: getStrengthColor(passwordStrength),
                            }}
                          ></div>
                        </div>
                        <span className="strength-label" style={{ color: getStrengthColor(passwordStrength) }}>
                          {getStrengthLabel(passwordStrength)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaLock className="label-icon" />
                      Confirm Password
                    </label>
                    <div className="input-wrapper">
                      <FaLock className="input-icon" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="form-input"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <div className="input-glow"></div>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <div className="password-mismatch">
                        <FaExclamationTriangle />
                        <span>Passwords do not match</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleResetPassword}
                    className="submit-btn"
                    disabled={
                      isLoading ||
                      !otp.trim() ||
                      !newPassword ||
                      !confirmPassword ||
                      passwordStrength < 3 ||
                      newPassword !== confirmPassword
                    }
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="spinner" />
                        <span>Resetting...</span>
                      </>
                    ) : (
                      <>
                        <FaCheck />
                        <span>Reset Password</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Password Requirements */}
                <div className="security-info">
                  <div className="security-header">
                    <FaShieldAlt className="security-icon" />
                    <h3>Password Requirements</h3>
                  </div>
                  <ul className="security-list">
                    <li className={newPassword.length >= 8 ? "valid" : ""}>At least 8 characters long</li>
                    <li className={/[a-z]/.test(newPassword) ? "valid" : ""}>Contains lowercase letters</li>
                    <li className={/[A-Z]/.test(newPassword) ? "valid" : ""}>Contains uppercase letters</li>
                    <li className={/[0-9]/.test(newPassword) ? "valid" : ""}>Contains numbers</li>
                    <li className={/[^A-Za-z0-9]/.test(newPassword) ? "valid" : ""}>Contains special characters</li>
                  </ul>
                </div>

                {/* OTP Info */}
                <div className="otp-info">
                  <FaInfoCircle className="info-icon" />
                  <p>
                    Didn't receive the OTP? Check your spam folder or{" "}
                    <button className="resend-link" onClick={handleBackToStep1}>
                      request a new one
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword
