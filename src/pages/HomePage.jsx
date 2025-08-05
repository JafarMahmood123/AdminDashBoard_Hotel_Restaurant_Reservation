import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar'; // Import Navbar
import '../assets/styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar /> {/* Add Navbar */}
      <div className="home-container">
        <header className="home-header">
          <h1>Admin Dashboard</h1>
          <p>Select a category to manage.</p>
        </header>
        <div className="button-grid">
          <button className="management-button" onClick={() => navigate('/users')}>
            User Management
          </button>
          <button className="management-button" onClick={() => navigate('/hotels')}>
            Hotel Management
          </button>
          <button className="management-button" onClick={() => navigate('/restaurants')}>
            Restaurant Management
          </button>
          <button className="management-button" onClick={() => navigate('/events')}>
            Event Management
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePage;