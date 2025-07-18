import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "./LogInPages.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import

const LogInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5281/User/Login", {
        email,
        password,
      });

      const token = response.data;
      
      localStorage.setItem("authToken", token);

      // 2. Decode the token to get the user's role
      const decodedToken = jwtDecode(token);
      
      const userRole = decodedToken.role || decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      console.log("Login successful! Role:", userRole);

      if (userRole.toUpperCase() === "ADMIN") {
        navigate("/admin"); // Redirect to the admin dashboard
      } else {
        navigate("/"); // Redirect regular users to the homepage
      }

    } catch (error) {
      console.error("Login failed:", error);
      // You can add logic here to show an error message to the user
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LogInPage;