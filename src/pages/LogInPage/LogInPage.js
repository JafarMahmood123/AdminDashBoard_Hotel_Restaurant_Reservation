import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LogInPages.css";
import axios from "axios";

const LogInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      // Assuming the API returns a JWT token in the response data
      const token = response.data;
      // You can now store the token (e.g., in localStorage) and redirect the user
      console.log("Login successful, token:", token);
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login error (e.g., show an error message to the user)
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
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default LogInPage;