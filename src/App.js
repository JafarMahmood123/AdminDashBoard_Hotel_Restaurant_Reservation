import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogInPage from "./pages/LogInPage/LogInPage.js";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard.js";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LogInPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<LogInPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
