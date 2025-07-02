"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuthStore } from "../store/authStore"
import { GamepadIcon as GameController, ShieldCheck, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      toast.success("Login successful!")
      navigate("/dashboard")
    } catch (err) {
      console.error(err)
      setError("Invalid credentials. Please try again.")
      toast.error("Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center p-3"
      style={{ background: "radial-gradient(ellipse at top, var(--primary-dark), var(--dark), var(--dark))" }}
    >
      <motion.div
        className="position-absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ zIndex: 0 }}
      >
        <div
          className="position-absolute top-0 start-0 translate-middle-y"
          style={{
            width: "18rem",
            height: "18rem",
            background: "var(--primary)",
            borderRadius: "50%",
            mixBlendMode: "multiply",
            filter: "blur(80px)",
            opacity: 0.1,
            animation: "float 6s ease-in-out infinite",
          }}
        ></div>
        <div
          className="position-absolute top-0 end-0 translate-middle-y"
          style={{
            width: "18rem",
            height: "18rem",
            background: "var(--secondary)",
            borderRadius: "50%",
            mixBlendMode: "multiply",
            filter: "blur(80px)",
            opacity: 0.1,
            animation: "float 6s ease-in-out infinite 2s",
          }}
        ></div>
        <div
          className="position-absolute bottom-0 start-50 translate-middle-x"
          style={{
            width: "18rem",
            height: "18rem",
            background: "var(--accent)",
            borderRadius: "50%",
            mixBlendMode: "multiply",
            filter: "blur(80px)",
            opacity: 0.1,
            animation: "float 6s ease-in-out infinite 4s",
          }}
        ></div>
      </motion.div>

      <motion.div
        className="glass-card p-4 p-md-5 position-relative"
        style={{ maxWidth: "28rem", width: "100%", zIndex: 10 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-4">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <GameController style={{ color: "var(--primary)" }} size={40} />
            <h1 className="fs-2 fw-bold ms-2 mb-0">
              <span style={{ color: "var(--primary)" }}>Game</span>
              <span style={{ color: "var(--accent)" }}>Zone</span>
            </h1>
          </div>
          <h2 className="fs-4 fw-semibold text-white mb-1">Admin Login</h2>
          <p className="text-white-50 small">Enter your credentials to access the admin panel</p>
        </div>

        {error && (
          <motion.div
            className="alert alert-danger d-flex align-items-center mb-4"
            style={{ backgroundColor: "rgba(220, 53, 69, 0.2)", borderColor: "rgba(220, 53, 69, 0.2)" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="text-danger me-2" size={20} />
            <p className="small text-danger mb-0">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label small fw-medium text-white-50">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="admin@gamezone.club"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label small fw-medium text-white-50">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <>
                <ShieldCheck className="me-2" size={20} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center small text-white-50">
          <p className="mb-1">Demo credentials:</p>
          <p className="mb-1">Email: admin@gamezone.club</p>
          <p className="mb-0">Password: admin123</p>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
