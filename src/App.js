import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogInPage from "./pages/LogInPage/LogInPage.js";
import HomePage from "./pages/HomePage/HomePage.jsx";
import UserManagementPage from "./pages/UserManagementPage/UserManagementPage.jsx";
import RestaurantManagementPage from "./pages/RestaurantManagementPage/RestaurantManagementPage.jsx";
import HotelManagementPage from "./pages/HotelManagementPage/HotelManagementPage.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LogInPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/user-management" element={<UserManagementPage />} />
          <Route path="/restaurant-management" element={<RestaurantManagementPage />} />
          <Route path="/hotel-management" element={<HotelManagementPage />} />
          <Route path="/event-management" element={<HomePage />} />
          <Route path="/" element={<LogInPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
