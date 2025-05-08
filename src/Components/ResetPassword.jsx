import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Extract token from URL
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
        //  http://localhost:3000/reset-password?token=c6711959-d9e5-4b56-8cea-353abae6aca7
      const response = await axios.post('http://localhost:3000/reset-password', {
        email,
        token,
        newPassword
      }, {
        withCredentials: true, // Important if your backend uses session
      });

      setMessage(response.data.message || "Password reset successful.");
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || 'Password reset failed.';
      setMessage(errorMsg);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "10px", fontSize: "16px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            required
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", fontSize: "16px" }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: "10px", background: "#007bff", color: "#fff", border: "none" }}>
          Reset Password
        </button>
      </form>
      {message && <p style={{ marginTop: "15px", color: "green" }}>{message}</p>}
    </div>
  );
}

export default ResetPassword;
