// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import UserManagement from './pages/UserManagement';
import HotelManagement from './pages/HotelManagement';
import RestaurantManagement from './pages/RestaurantManagement';
import UserProfile from '.src/pages/UserProfile';

// ... (isAuthenticated and PrivateRoute)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {/* Add the new route here */}
          <Route path="profile" element={<UserProfile />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="hotels" element={<HotelManagement />} />
          <Route path="restaurants" element={<RestaurantManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;