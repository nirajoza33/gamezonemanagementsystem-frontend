import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserInfo } from '../../auth/JwtUtils'; // Import your function to get logged-in user info
import AdminNavbar from './AdminNavbar';

const AdminChangePassword = () => {
  const navigate = useNavigate();

  // Get the logged-in user's info (including userId)
  const userInfo = getUserInfo();
  const userId = userInfo?.UserId;  // Assuming `userId` is part of the user info

  // State variables for form inputs and error/success messages
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation password do not match.");
      return;
    }

    if (!userId) {
      setError("User is not authenticated.");
      return;
    }

    try {
      const response = await axios.post('https://localhost:7186/api/Tblusers/change-password', {
        userId: userId,    // Send the dynamic userId here
        oldPassword: oldPassword,
        newPassword: newPassword
      });

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setError('');
        // You can redirect the user to the profile page or login page after success
        setTimeout(() => {
          navigate('/'); // Redirect to the profile page
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred while changing the password.");
      setSuccessMessage('');
    }
  };

  return (
    <>
    <AdminNavbar/>
    <div className="change-password-container" 
    style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#000', // optional: to make white text visible
        color: 'white',
        textAlign: 'center'
      }}>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="oldPassword">Old Password</label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button type="submit" className="submit-btn">Change Password</button>
      </form>
    </div>
    </>
  );
};

export default AdminChangePassword;
