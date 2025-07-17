import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Welcome to the Admin Dashboard</h1>
        <p>
          Your one-stop solution for managing hotel and restaurant reservations.
        </p>
      </header>
      <nav className="homepage-nav">
        <Link to="/login" className="nav-link">
          Login
        </Link>
        <Link to="/signup" className="nav-link">
          Sign Up
        </Link>
      </nav>
    </div>
  );
};

export default HomePage;
