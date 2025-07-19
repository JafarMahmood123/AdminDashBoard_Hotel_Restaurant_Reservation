import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogInPage from "./pages/LogInPage/LogInPage.js";
import HomePage from "./pages/HomePage/HomePage.jsx";
import RestaurantManagement from "./pages/RestaurantManagement/RestaurantManagement.js";
import HotelManagement from "./pages/HotelManagement/HotelManagement.js";
import UserManagementPage from "./pages/UserManagementPage/UserManagementPage.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LogInPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/user-management" element={<UserManagementPage />} />
          <Route path="/restaurant-management" element={<RestaurantManagement />} />
          <Route path="/hotel-management" element={<HotelManagement />} />
          <Route path="/event-management" element={<HomePage />} />
          <Route path="/" element={<LogInPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
