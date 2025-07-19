import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogInPage from "./pages/LogInPage/LogInPage.js";
import HomePage from "./pages/HomePage/HomePage.jsx";
import UserManagement from "./pages/UserManagement/UserManagement.js";
import RestaurantManagement from "./pages/RestaurantManagement/RestaurantManagement.js";
import HotelManagement from "./pages/HotelManagement/HotelManagement.js";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LogInPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/usermanagement" element={<UserManagement />} />
          <Route path="/restaurantmanagement" element={<RestaurantManagement />} />
          <Route path="/hotelmanagement" element={<HotelManagement />} />
          <Route path="/eventmanagement" element={<HomePage />} />
          <Route path="/" element={<LogInPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
