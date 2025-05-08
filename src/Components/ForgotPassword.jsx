import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    try {
      const formData = new FormData();
      formData.append("toEmail", email);

      const res = await axios.post("https://localhost:7186/api/Tblusers/send-forgot-otp", formData, {
        withCredentials: true, // IMPORTANT for session
      });

      setMessage(res.data);
      setStep(2); // Move to OTP and password step
    } catch (error) {
      setMessage(error.response?.data || "Failed to send OTP");
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await axios.post(
        "https://localhost:7186/api/Tblusers/verify-otp-and-reset-password",
        {
          otp,
          newPassword,
          confirmPassword,
        },
        {
          withCredentials: true, // Needed for session
        }
      );

      setMessage(res.data.message);
      setStep(1); // Reset back to step 1 after success
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <>
    <Navbar/>   
    <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem", marginTop:"50px"}}>
      <h2>Forgot Password</h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ display: "block", marginBottom: "1rem", width: "100%" }}
          />
          <button onClick={handleSendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={{ display: "block", marginBottom: "1rem", width: "100%" }}
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ display: "block", marginBottom: "1rem", width: "100%" }}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ display: "block", marginBottom: "1rem", width: "100%" }}
          />

          <button onClick={handleResetPassword}>Reset Password</button>
        </>
      )}

      {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
    </div>
    </>
  );
};

export default ForgotPassword;
