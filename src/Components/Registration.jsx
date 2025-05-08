import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import bg2 from "../images/bg2.jpg";
import { useNavigate, Link } from "react-router-dom";
import "../css/Forms.css";
import Navbar from "./Navbar";
import { getUserRole, isAuthenticated } from "../auth/JwtUtils";

const API_BASE_URL = "https://localhost:7186/api"; // Adjust as per your backend

const Registration = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
  });

  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send OTP API Call
  const sendOtp = async () => {
    if (!formData.email) {
      Swal.fire("Error", "Please enter an email to receive OTP!", "error");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/Tblusers/send-otp`, {
        email: formData.email,
      }, { withCredentials: true });

      if (response.data.success) {
        setIsOtpSent(true);
        Swal.fire("Success", response.data.message, "success");
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.log(error)
      Swal.fire("Error", "Failed to send OTP!", "error");
    }
  };

  // Verify OTP API Call
  const verifyOtp = async () => {
    if (!otp) {
      Swal.fire("Error", "Please enter the OTP!", "error");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/Tblusers/verify-otp`, {
        email: formData.email,
        otp: otp,
      }, { withCredentials: true });

      if (response.data.success) {
        setIsOtpVerified(true);
        setIsOtpSent(false); // Hide OTP fields after verification
        Swal.fire("Success", response.data.message, "success");
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.log(error)
      Swal.fire("Error", "Invalid or expi OTP!", "error");
    }
  };

  // Register User API Call
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      Swal.fire("Error", "Please verify OTP before registering!", "error");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/Tblusers/register`, {
        userName: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        bio: formData.bio,
        roleId: 3, // Assuming role ID for users
      });

      if (response.data.success) {
        Swal.fire("Success", response.data.message, "success").then(() => {
          navigate("/login"); // Redirect to login page
        });
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Registration failed!", "error");
    }
  };

  // ✅ Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      const role = getUserRole();
      switch (role) {
        case "Admin":
          navigate("/Admin/dashboard");
          break;
        case "GameZoneOwner":
          navigate("/GameZoneOwner/dashboard");
          break;
        case "User":
          navigate("/user/dashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div
        className="d-flex align-items-center justify-content-center vh-100"
        style={{
          backgroundImage: `url(${bg2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,20,0.6)", zIndex: 1 }}
        />
        <div
          className="p-4 rounded shadow-lg text-white"
          style={{
            width: "350px",
            background: "rgba(20, 20, 60, 0.85)",
            backdropFilter: "blur(5px)",
            borderRadius: "20px",
            zIndex: 2,
            position: "relative",
            marginTop: "100px" // 👈 Adds space from the fixed navbar
          }}
        >

          <h3 className="text-center mb-4" style={{ color: "#00f2fe" }}>
            Game Zone
          </h3>

          <div className="d-flex justify-content-center mb-4">
            <Link to="/register">
              <button className="btn auth-register-btn me-3 px-4 py-2">
                REGISTER
              </button>
            </Link>
            <Link to="/login">
              <button className="btn auth-login-btn px-4 py-2">
                LOG IN
              </button>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="compact-form">
            <div className="mb-3 position-relative floating-label-input" style={{ "--animation-order": 1 }}>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-control bg-dark text-white border-0"
                required
                id="usernameField"
                placeholder=" "
              />
              <label htmlFor="usernameField">Username</label>
            </div>

            <div className="mb-3 position-relative floating-label-input" style={{ "--animation-order": 2 }}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control bg-dark text-white border-0"
                required
                disabled={isOtpSent || isOtpVerified}
                id="emailField"
                placeholder=" "
              />
              <label htmlFor="emailField">Email Address</label>
            </div>

            {/* OTP Verification Field */}
            {isOtpSent && !isOtpVerified && (
              <div className="mb-3 position-relative floating-label-input" style={{ "--animation-order": 3 }}>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="form-control bg-dark text-white border-0"
                  required
                  id="otpField"
                  placeholder=" "
                />
                <label htmlFor="otpField">Enter OTP</label>
                <button
                  type="button"
                  className="btn btn-sm w-100 mt-1"
                  onClick={verifyOtp}
                  style={{
                    background: "linear-gradient(to right, #00f2fe, #4facfe)",
                    border: "none",
                    color: "#000",
                    fontWeight: "bold"
                  }}
                >
                  Verify OTP
                </button>
              </div>
            )}

            <div className="mb-3 position-relative floating-label-input" style={{ "--animation-order": 3 }}>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control bg-dark text-white border-0"
                required
                id="passwordField"
                placeholder=" "
              />
              <label htmlFor="passwordField">Password</label>
            </div>

            <div className="mb-3 position-relative floating-label-input" style={{ "--animation-order": 4 }}>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control bg-dark text-white border-0"
                required
                id="phoneField"
                placeholder=" "
              />
              <label htmlFor="phoneField">Phone Number</label>
            </div>

            <div className="mb-3 position-relative floating-label-input" style={{ "--animation-order": 5 }}>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="form-control bg-dark text-white border-0"
                // required
                id="bioField"
                placeholder=" "
                style={{ height: "50px", paddingTop: "20px" }}
              />
              <label htmlFor="bioField">Bio</label>
            </div>

            {/* Send OTP Button */}
            {!isOtpSent && !isOtpVerified && (
              <div style={{ "--animation-order": 6, animation: "slideUp 0.5s ease-out forwards", opacity: 0, transform: "translateY(10px)", animationDelay: "calc(0.1s * 6)" }}>
                <button
                  type="button"
                  className="btn w-100 mt-2"
                  onClick={sendOtp}
                  style={{
                    background: "linear-gradient(to right, #00f2fe, #4facfe)",
                    border: "none",
                    color: "#000",
                    fontWeight: "bold"
                  }}
                >
                  Send OTP
                </button>
              </div>
            )}

            {/* Register Button */}
            {isOtpVerified && (
              <div style={{ "--animation-order": 6, animation: "slideUp 0.5s ease-out forwards", opacity: 0, transform: "translateY(10px)", animationDelay: "calc(0.1s * 6)" }}>
                <button
                  type="submit"
                  className="btn w-100 mt-2"
                  style={{
                    background: "linear-gradient(to right, #00f2fe, #4facfe)",
                    border: "none",
                    color: "#000",
                    fontWeight: "bold"
                  }}
                >
                  Create Account
                </button>
              </div>
            )}

            <div className="text-center mt-3" style={{ "--animation-order": 7, animation: "slideUp 0.5s ease-out forwards", opacity: 0, transform: "translateY(10px)", animationDelay: "calc(0.1s * 7)" }}>
              <Link to="/login" className="text-info">Already have an account? Login</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Registration;
