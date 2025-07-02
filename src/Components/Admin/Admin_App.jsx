import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layout
import Layout from "./components/layout/Layout";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UserManagementPage from "./pages/UserManagementPage";
import GameManagementPage from "./pages/GameManagementPage";
import SubscriptionPage from "./pages/SubscriptionPage";

function Admin_App() {
  useEffect(() => {
    // Any initialization logic if needed (without auth)
  }, []);

  return (
    <>
      <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="/Admin" element={<Layout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="games" element={<GameManagementPage />} />
        <Route path="subscriptions" element={<SubscriptionPage />} />
        <Route path="permissions" element={<div className="p-4">Permissions management coming soon</div>} />
        <Route path="settings" element={<div className="p-4">Settings page coming soon</div>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#131A2B",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
          success: {
            iconTheme: {
              primary: "#05D9E8",
              secondary: "#131A2B",
            },
          },
          error: {
            iconTheme: {
              primary: "#FF2A6D",
              secondary: "#131A2B",
            },
          },
        }}
      />
    </>
  );
}

export default Admin_App;
