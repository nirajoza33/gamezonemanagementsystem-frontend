"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaUser, FaTimes } from "react-icons/fa"
import "../css/LoginPopup.css"

const LoginPopup = ({ isOpen, onClose, message, redirectPath }) => {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300) // Match this with CSS transition time
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleLogin = () => {
    onClose()
    navigate("/login", { state: { returnPath: redirectPath } })
  }

  const handleSignup = () => {
    onClose()
    navigate("/register", { state: { returnPath: redirectPath } })
  }

  if (!isOpen && !isVisible) return null

  return (
    <div className={`login-popup-overlay ${isOpen ? "active" : "closing"}`}>
      <div className="login-popup-container">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="popup-icon">
          <FaUser />
        </div>

        <h2>Login Required</h2>
        <p>{message || "Please login to continue with this action."}</p>

        <div className="popup-buttons">
          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
          <button className="signup-button" onClick={handleSignup}>
            Sign Up
          </button>
        </div>

        <div className="popup-footer">
          <p>
            Continue as guest? <button onClick={onClose}>Go back</button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPopup
