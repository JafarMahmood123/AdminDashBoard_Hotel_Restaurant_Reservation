import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import LogInPage from "./pages/LogInPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import UserManagementPage from "./pages/UserManagementPage.jsx";
import RestaurantManagementPage from "./pages/RestaurantManagementPage.jsx";
import HotelManagementPage from "./pages/HotelManagementPage.jsx";
import AmenitiesPage from "./pages/AmenitiesPage.jsx";

const PrivateLayout = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" />;
};

const PublicLayout = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" /> : <Outlet />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LogInPage />} />
        </Route>

        <Route element={<PrivateLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/restaurants" element={<RestaurantManagementPage />} />
          <Route path="/hotels" element={<HotelManagementPage />} />
          <Route path="/hotels/:hotelId/amenities" element={<AmenitiesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;