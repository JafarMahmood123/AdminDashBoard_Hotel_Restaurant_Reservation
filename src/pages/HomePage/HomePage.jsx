import React, { useState } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const handleUserManagement = () => {
        navigate('/user-management');
    };

    const handleRestaurantManagement = () => {
        navigate('/restaurant-management');
    };

    const handleHotelManagement = () => {
        navigate('/hotel-management');
    };
    const handleEventManagement = () => {
        navigate('/event-management');
    };

    return (
        <div className="home-page">
            <div className="header">
                <h1>Admin Dashboard</h1>
            </div>
            <div className="dashboard">
                <div className="dashboard-item" onClick={handleUserManagement}>
                    <h2>User Management</h2>
                    <p>Manage user accounts and permissions.</p>
                </div>
                <div className="dashboard-item" onClick={handleRestaurantManagement}>
                    <h2>Restaurant Management</h2>
                    <p>Manage restaurant listings and bookings.</p>
                </div>
                <div className="dashboard-item" onClick={handleHotelManagement}>
                    <h2>Hotel Management</h2>
                    <p>Manage hotel listings and reservations.</p>
                </div>
                <div className="dashboard-item" onClick={handleEventManagement}>
                    <h2>Event Management</h2>
                    <p>Manage hotel listings and reservations.</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;