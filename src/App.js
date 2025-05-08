import logo from './logo.svg';
import './App.css';
import Registration from './Components/Registration';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import GameManager from './Components/Owner/GameManager';
import PrivateRoute from './auth/PrivateRoute';
import AdminDashboard from './Components/Admin/AdminDashboard';
import GamezoneOwner from './Components/Owner/GamezoneOwner';
import { isAuthenticated, isTokenExpired, getToken, logout } from "./auth/JwtUtils";
import { useEffect } from 'react';
import GameCategoryManager from './Components/Owner/GameCategoryManager';
import ForgotPassword from './Components/ForgotPassword';
import Forbidden from './Components/Forbidden';
import ChangePassword from './Components/ChangePassword';
import UserProfile from './Components/UserProfile';
import Booking from './Components/Booking';
import OwnerChangePassword from './Components/Owner/OwnerChangePassword';
import OwnerViewProfile from './Components/Owner/OwnerViewprofile';
import Games from './Components/Games';

function App() {
  // useEffect(() => {
  //   const token = getToken();

  //   if (token && isTokenExpired(token)) {
  //     logout();
  //   }

  //   const interval = setInterval(() => {
  //     if (!isAuthenticated()) {
  //       logout();
  //     }
  //   }, 60 * 1000); // every 1 min check

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="App">
      <Router>
        {/* <Navbar/> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/user-profile" element={<UserProfile />} />
          {/* <Route path="/GameZoneOwner/add-games" element={<GameManager />} /> */}
          <Route path="/register" element={<Registration />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/games" element={<Games />} />



          <Route
            path="/Admin/dashboard"
            element={
              <PrivateRoute allowedRoles={["Admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          
        
          <Route
            path="/GameZoneOwner/dashboard"
            element={
              <PrivateRoute allowedRoles={["GameZoneOwner"]}>
                <GamezoneOwner />
              </PrivateRoute>
            }
          />
          <Route
            path="/GameZoneOwner/add-games"
            element={
              <PrivateRoute allowedRoles={["GameZoneOwner"]}>
                <GameManager />
              </PrivateRoute>
            }
          />
          <Route
            path="/GameZoneOwner/add-game-category"
            element={
              <PrivateRoute allowedRoles={["GameZoneOwner"]}>
                <GameCategoryManager />
              </PrivateRoute>
            }
          />
          <Route
            path="/GameZoneOwner/ownerChangePassword"
            element={
              <PrivateRoute allowedRoles={["GameZoneOwner"]}>
                <OwnerChangePassword />
              </PrivateRoute>
            }
          />
          <Route
            path="/GameZoneOwner/ownerViewprofile"
            element={
              <PrivateRoute allowedRoles={["GameZoneOwner"]}>
                <OwnerViewProfile />
              </PrivateRoute>
            }
          />

        <Route path="/forbidden" element={<Forbidden />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
