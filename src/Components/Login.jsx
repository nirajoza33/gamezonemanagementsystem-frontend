"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { useNavigate, Link, useLocation } from "react-router-dom"
import "../css/Forms.css"
import { decodeToken, isAuthenticated, getUserRole } from "../auth/JwtUtils"
import { FaEye, FaEyeSlash, FaUser, FaLock, FaExclamationTriangle } from "react-icons/fa"
import { GiRetroController } from "react-icons/gi"
import debounce from "lodash.debounce"
import Lottie from "react-lottie"
import animationData from "../animations/gaming-loader.json"

const Login = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ email: "", password: "" })
  const [validationState, setValidationState] = useState({
    email: { status: "idle", message: "" },
    password: { status: "idle", message: "" },
    credentials: { status: "idle", message: "" },
  })
  const [error, setError] = useState(null)
  const [errorType, setErrorType] = useState(null) // 'inactive', 'suspended', 'invalid', 'general'
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  // Lottie animation options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }

  // ✅ Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      const role = getUserRole()
      switch (role) {
        case "Admin":
          navigate("/Admin/dashboard")
          break
        case "GameZoneOwner":
          navigate("/GameZoneOwner/dashboard")
          break
        case "User":
          navigate("/")
          break
        default:
          navigate("/")
      }
    }
  }, [navigate])

  // Debounced API validation function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const verifyCredentials = useCallback(
    debounce(async (email, password) => {
      if (!email || !password) return

      // Only verify if both fields have values and email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) return

      try {
        setIsVerifying(true)

        // Use a lightweight endpoint to verify credentials without actually logging in
        const response = await axios.post(
          "https://localhost:7186/api/Tblusers/verify-credentials",
          { email, password },
          { headers: { "Content-Type": "application/json" } },
        )

        if (response.data.isValid) {
          setValidationState((prev) => ({
            ...prev,
            credentials: { status: "valid", message: "" },
          }))
        } else {
          setValidationState((prev) => ({
            ...prev,
            credentials: { status: "invalid", message: "Invalid email or password" },
          }))
        }
      } catch (error) {
        // Don't show explicit error to user for security reasons
        console.error("Verification error:", error)
        setValidationState((prev) => ({
          ...prev,
          credentials: { status: "idle", message: "" },
        }))
      } finally {
        setIsVerifying(false)
      }
    }, 600),
    [],
  )

  // Validate email format
  const validateEmail = (email) => {
    if (!email) return { status: "idle", message: "" }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { status: "invalid", message: "" }
    }

    return { status: "valid", message: "" }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (error) {
      setError(null)
      setErrorType(null)
    }

    // Email validation
    if (name === "email") {
      const emailValidation = validateEmail(value)
      setValidationState((prev) => ({
        ...prev,
        email: emailValidation,
        credentials: { status: "idle", message: "" }, // Reset credentials validation
      }))
    }

    // If both fields have values, verify credentials
    if ((formData.email && name === "password" && value) || (name === "email" && value && formData.password)) {
      const emailToVerify = name === "email" ? value : formData.email
      const passwordToVerify = name === "password" ? value : formData.password
      verifyCredentials(emailToVerify, passwordToVerify)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Don't submit if already verifying or loading
    if (isVerifying || isLoading) return

    // Don't submit if credentials are invalid
    if (validationState.credentials.status === "invalid") {
      setError("Invalid email or password. Please check your credentials.")
      setErrorType("invalid")
      return
    }

    // Don't submit if email is invalid
    if (validationState.email.status === "invalid") {
      setError("Please enter a valid email address.")
      setErrorType("invalid")
      return
    }

    setError(null)
    setErrorType(null)
    setIsLoading(true)

    try {
      const response = await axios.post("https://localhost:7186/api/Tblusers/login", formData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })

      const token = response.data.token
      const decoded = decodeToken(token)

      // Check user status from the token
      const userStatus = decoded?.Status?.toLowerCase()
      console.log("acc",userStatus)

      if (userStatus === "suspended" || userStatus === "inactive") {
        setError("Your account has been suspended or deactivated. Please contact support for assistance.")
        setErrorType("suspended")
        return
      }

      // Store token and user data
      sessionStorage.setItem("token", token)
      sessionStorage.setItem("user", JSON.stringify(decoded))
      sessionStorage.setItem("username", JSON.stringify(decoded))

      // Navigate based on role
      const role = decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      switch (role) {
        case "Admin":
          navigate("/Admin/dashboard")
          break
        case "GameZoneOwner":
          navigate("/GameZoneOwner/dashboard")
          break
        case "User":
          navigate("/")
          break
        default:
          navigate("/login")
      }
    } catch (error) {
      console.error(error)

      // Handle different types of errors
      const errorMessage = error.response?.data?.message || "Login failed. Please try again."
      const statusCode = error.response?.status

      if (statusCode === 403) {
        setError("Your account has been suspended or deactivated. Please contact support for assistance.")
        setErrorType("suspended")
      } else if (statusCode === 401) {
        setError("Invalid email or password. Please check your credentials.")
        setErrorType("invalid")
      } else if (errorMessage.toLowerCase().includes("suspended") || errorMessage.toLowerCase().includes("inactive")) {
        setError("Your account has been suspended or deactivated. Please contact support for assistance.")
        setErrorType("suspended")
      } else {
        setError(errorMessage)
        setErrorType("general")
      }

      // Update validation state to show invalid credentials
      setValidationState((prev) => ({
        ...prev,
        credentials: { status: "invalid", message: "Invalid email or password" },
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // Get input status class based on validation
  const getInputStatusClass = (field) => {
    if (field === "credentials") {
      return validationState.credentials.status === "valid"
        ? "input-valid"
        : validationState.credentials.status === "invalid"
          ? "input-invalid"
          : ""
    }

    return validationState[field].status === "valid"
      ? "input-valid"
      : validationState[field].status === "invalid"
        ? "input-invalid"
        : ""
  }

  // Get error message class based on error type
  const getErrorClass = () => {
    switch (errorType) {
      case "suspended":
        return "error-message error-suspended"
      case "invalid":
        return "error-message error-invalid"
      default:
        return "error-message"
    }
  }

  return (
    <>
      <div className="login-container">
        {/* Animated background elements */}
        <div className="login-bg-elements">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
        </div>

        {/* Background overlay */}
        <div className="login-overlay"></div>

        {/* Main login card */}
        <div className="login-card">
          {/* Enhanced 3D Logo */}
          <div className="login-header">
            <div className="login-icon">
              <GiRetroController />
            </div>
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to continue your gaming journey</p>
          </div>

          {/* Auth Toggle */}
          <div className="auth-toggle">
            <Link to="/register" className="auth-toggle-btn">
              <span>REGISTER</span>
            </Link>
            <Link to="/login" className="auth-toggle-btn active">
              <span>LOGIN</span>
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className={getErrorClass()}>
              {errorType === "suspended" && <FaExclamationTriangle className="error-icon" />}
              <span>{error}</span>
              {errorType === "suspended" && (
                <div className="error-actions">
                  <Link to="/contact-support" className="support-link">
                    Contact Support
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="form-group" data-label="EMAIL">
              <div className={`input-wrapper ${getInputStatusClass("email")}`}>
                <FaUser className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Enter your email"
                  disabled={isLoading}
                  aria-invalid={validationState.email.status === "invalid"}
                />
                {validationState.email.status !== "idle" && <span className="validation-indicator"></span>}
              </div>
            </div>

            <div className="form-group" data-label="PASSWORD">
              <div className={`input-wrapper ${getInputStatusClass("credentials")}`}>
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Enter your password"
                  disabled={isLoading}
                  aria-invalid={validationState.credentials.status === "invalid"}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {validationState.credentials.status !== "idle" && formData.password && (
                  <span className="validation-indicator"></span>
                )}
              </div>
              <div className="forgot-password">
                <Link to="/forgotpassword">Forgot Password?</Link>
              </div>
            </div>

            <button
              type="submit"
              className={`login-btn ${isLoading ? "loading" : ""} ${isVerifying ? "verifying" : ""} ${errorType === "suspended" ? "btn-disabled" : ""}`}
              disabled={isLoading || isVerifying || errorType === "suspended"}
            >
              {isLoading ? (
                "Authenticating..."
              ) : isVerifying ? (
                <span>Verifying...</span>
              ) : errorType === "suspended" ? (
                <span>Account Suspended</span>
              ) : (
                <span>Login to Account</span>
              )}
            </button>

            <div className="signup-link">
              <span>Don't have an account? </span>
              <Link to="/register">Create Account</Link>
            </div>
          </form>
        </div>

        {/* Lottie Animation Loader with Glassmorphism Overlay */}
        {isLoading && (
          <div className="lottie-loading-overlay">
            <div className="glassmorphism-backdrop"></div>
            <div className="lottie-container">
              <Lottie options={defaultOptions} height={200} width={200} />
              <div className="loading-text">
                <div className="loading-dots">
                  <span className="dot dot-1">.</span>
                  <span className="dot dot-2">.</span>
                  <span className="dot dot-3">.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Login
