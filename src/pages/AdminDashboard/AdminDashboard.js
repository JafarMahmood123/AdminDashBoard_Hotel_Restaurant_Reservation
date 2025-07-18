import React from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>
      <main className="dashboard-main">
        <section className="summary-section">
          <div className="summary-card">
            <h2>Total Users</h2>
            <p>1,234</p>
          </div>
          <div className="summary-card">
            <h2>Total Restaurants</h2>
            <p>56</p>
          </div>
          <div className="summary-card">
            <h2>Total Hotels</h2>
            <p>78</p>
          </div>
        </section>
        <section className="management-section">
          <h2>Management</h2>
          <div className="management-links">
            <a href="#users" className="management-link">
              User Management
            </a>
            <a href="#restaurants" className="management-link">
              Restaurant Management
            </a>
            <a href="#hotels" className="management-link">
              Hotel Management
            </a>
            <a href="#events" className="management-link">
              Event Management
            </a>
            <a href="#locations" className="management-link">
              Location Management
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
