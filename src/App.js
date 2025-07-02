  import logo from './logo.svg';
  import './App.css';
  import Registration from './Components/Registration';
  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
  import AdminViewProfile from './Components/Admin/AdminViewProfile';
  import AdminChangePassword from './Components/Admin/AdminChangePassword';
  import Review from './Components/Review';
  import Layout from './Components/Admin/components/layout/Layout';
  import DashboardPage from './Components/Admin/pages/DashboardPage';
  import UserManagementPage from './Components/Admin/pages/UserManagementPage';
  import GameManagementPage from './Components/Admin/pages/GameManagementPage';
  import SubscriptionPage from './Components/Admin/pages/SubscriptionPage';
  // import Layout from './Components/Admin/layout/Layout';
  import '../src/Components/Admin/index.css'
  import ViewProfile from './Components/Admin/pages/ViewProfile';
  import ChangePasswordAdmin from './Components/Admin/pages/ChangePassword';
  import UserBookingsPage from './Components/UserBookedGames';
  import OffersPage from './Components/OffersPage';
  import AboutPage from './Components/AboutUs';
  import GameDetailsPopup from './Components/GameDetailsPopup';
  import AnalyticsPage from './Components/Owner/AnalyticsPage';
  import OwnerGames from './Components/OwnerGames';
  import GameRunningStatus from './Components/Owner/GameRunningStatus';
  import OffersManager from './Components/Owner/OffersManager';
  import MyOffersPage from './Components/MyOffersPage';
import Chatbot from './Components/ChatBot';


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
            {/* <Route path="/change-password" element={<ChangePassword />} /> */}
            {/* <Route path="/user-profile" element={<UserProfile />} /> */}
            {/* <Route path="/GameZoneOwner/add-games" element={<GameManager />} /> */}
            <Route path="/register" element={<Registration />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/games" element={<Games />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/gameDetail" element={<GameDetailsPopup />} />
            <Route path="/review" element={<Review />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/bookedGames" element={<UserBookingsPage />} />
            <Route path="/my-offers" element={<MyOffersPage />} />
            <Route path="/owner-games/:ownerId" element={<OwnerGames />} />


            <Route
              path="/"
              element={
                <PrivateRoute allowedRoles={["User"]}>
                  <Home />
                </PrivateRoute>
              }
            />

            <Route
              path="/User/change-password"
              element={
                <PrivateRoute allowedRoles={["User"]}>
                  <ChangePassword />
                </PrivateRoute>
              }
            />

            <Route
              path="/User/user-profile"
              element={
                <PrivateRoute allowedRoles={["User"]}>
                  <UserProfile />
                </PrivateRoute>
              }
            />

            <Route
              path="/User/booking"
              element={
                <PrivateRoute allowedRoles={["User"]}>
                  <Booking />
                </PrivateRoute>
              }
            />

            <Route
              path="/User/games"
              element={
                <PrivateRoute allowedRoles={["User"]}>
                  <Games />
                </PrivateRoute>
              }
            />

            <Route
              path="/User/review"
              element={
                <PrivateRoute allowedRoles={["User"]}>
                  <Review />
                </PrivateRoute>
              }
            />

            <Route path="/Admin" element={<PrivateRoute allowedRoles={["Admin"]}><Layout /></PrivateRoute>}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="users" element={<UserManagementPage />} />
              <Route path="games" element={<GameManagementPage />} />
              <Route path="subscriptions" element={<SubscriptionPage />} />
              <Route path="viewProfile" element={<ViewProfile />} />
              <Route path="changePassword" element={<ChangePasswordAdmin />} />
              <Route path="permissions" element={<div className="p-4">Permissions management coming soon</div>} />
              <Route path="settings" element={<div className="p-4">Settings page coming soon</div>} />
            </Route>


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
            <Route
              path="/GameZoneOwner/analytics"
              element={
                <PrivateRoute allowedRoles={["GameZoneOwner"]}>
                  <AnalyticsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/GameZoneOwner/running-status"
              element={
                <PrivateRoute allowedRoles={["GameZoneOwner"]}>
                  <GameRunningStatus />
                </PrivateRoute>
              }
            />
            <Route
              path="/GameZoneOwner/offers"
              element={
                <PrivateRoute allowedRoles={["GameZoneOwner"]}>
                  <OffersManager />
                </PrivateRoute>
              }
            />


            <Route
              path="/Admin/adminViewprofile"
              element={
                <PrivateRoute allowedRoles={["Admin"]}>
                  <AdminViewProfile />
                </PrivateRoute>
              }
            />

            <Route
              path="/Admin/adminChangePassword"
              element={
                <PrivateRoute allowedRoles={["Admin"]}>
                  <AdminChangePassword />
                </PrivateRoute>
              }
            />

            <Route path="/forbidden" element={<Forbidden />} />
          </Routes>
        </Router>
        {/* <Chatbot/> */}
      </div>
    );
  }

  export default App;
