import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, getUserInfo, logout } from '../auth/JwtUtils'; // Import logout function
import '../css/UserProfile.css';
import Navbar from './Navbar';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [bio, setBio] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showModal, setShowModal] = useState(false); // To control the visibility of the modal
    const navigate = useNavigate();
  
    useEffect(() => {
      // Fetch user data when the component is mounted
      const fetchUserData = async () => {
        try {
          const token = getToken(); // Get token from session or localStorage
          if (!token) {
            setError("No token found. Please log in.");
            return;
          }
  
          const userInfo = getUserInfo(); // Decode the JWT to get user info
          if (userInfo) {
            setUser(userInfo); // Set user info in the state
            setBio(userInfo.Bio || '');
            setPhone(userInfo.Phone || '');
            setEmail(userInfo.sub || '');
            setUserName(userInfo.UserName || '');
          } else {
            setError("Error: No valid user data.");
          }
        } catch (err) {
          setError("Error fetching user data.");
        }
      };
  
      fetchUserData();
    }, []);
  
    const handleLogout = () => {
      logout(); // Calls logout function from jwtUtils.js
      navigate('/login');
    };

    const handleUpdate = async (e) => {
        e.preventDefault(); // Prevent form submission
        const token = getToken();
        if (!token) {
          setError("You must be logged in to update your profile.");
          return;
        }
      
        try {
          const userId = user.UserId; // Get user ID
          const updatedData = {
            Bio: bio,
            Phone: phone,
            Email: email,
            UserName: userName,
          };
      
          const response = await axios.put(
            `https://localhost:7186/api/Tblusers/${userId}`, // Replace with your API URL
            updatedData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
      
          if (response.status === 200) {
            setUpdateSuccess(true); // Indicate the update was successful
            setUser((prevState) => ({
              ...prevState,
              Bio: bio,
              Phone: phone,
              Email: email,
              UserName: userName,
            }));
            setShowModal(false); // Close the modal after saving
          }
        } catch (err) {
          setError("Error updating profile.");
        }
    };

    if (error) {
      return <div className="error-message">{error}</div>;
    }
  
    if (!user) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="profile-page">
        <Navbar/>
        <h2>Profile Information</h2>
        <div className="profile-details">
          <div>
            <strong>Username:</strong> {user.UserName}
          </div>
          <div>
            <strong>Email:</strong> {user.sub}
          </div>
          <div>
            <strong>Phone:</strong> {user.Phone}
          </div>
          <div>
            <strong>Bio:</strong> {user.Bio || 'No bio available.'}
          </div>
          <div>
            <strong>Role:</strong> {user.RoleId == 1 ? 'Admin' : user.RoleId == 2 ? 'GameZoneOwner' : 'User'}
          </div>
        </div>

        {/* Update Button */}
        <button onClick={() => setShowModal(true)}>Update Profile</button>

        {/* Modal for updating profile */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Update Profile</h3>
              <form onSubmit={handleUpdate}>
                <div>
                  <label>Bio:</label>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Update your bio"
                  />
                </div>
                <div>
                  <label>Phone:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Update your phone number"
                  />
                </div>
                <div>
                  <label>Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Update your email"
                  />
                </div>
                <div>
                  <label>Username:</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Update your username"
                  />
                </div>
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}
  
        {updateSuccess && <div className="success-message">Profile updated successfully!</div>}
      </div>
    );
};

export default UserProfile;
