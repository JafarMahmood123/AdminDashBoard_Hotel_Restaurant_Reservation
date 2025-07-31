import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import LogInPage from "./pages/LogInPage.jsx";
import UserManagementPage from "./pages/UserManagementPage/UserManagementPage.jsx";
import RestaurantManagementPage from "./pages/RestaurantManagementPage.jsx";
import HotelManagementPage from "./pages/HotelManagementPage.jsx";

/**
 * A layout component for routes that should only be accessible to authenticated users.
 * It checks for a token and redirects to the login page if it's not found.
 */
const PrivateLayout = () => {
  const token = localStorage.getItem("token");
  // In a real app, you'd also want to validate the token (e.g., check expiration)
  return token ? <Outlet /> : <Navigate to="/login" />;
};

/**
 * A layout component for routes that should only be accessible to unauthenticated users.
 * If a user is already logged in, it redirects them to the home page.
 */
const PublicLayout = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" /> : <Outlet />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes: Only accessible when not logged in */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LogInPage />} />
        </Route>

        {/* Private Routes: Only accessible when logged in */}
        <Route element={<PrivateLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/restaurants" element={<RestaurantManagementPage />} />
          <Route path="/hotels" element={<HotelManagementPage />} />
        </Route>

        {/* Fallback route to redirect any unknown paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
