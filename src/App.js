import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LogInPage from "./pages/LogInPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LogInPage />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
