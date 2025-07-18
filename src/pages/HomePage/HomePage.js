import React from "react";

const HomePage = ({ user }) => {
  return (
    <div>
      <h1>Welcome to the Hotel, Restaurant, and Reservation System</h1>
      {/* ... other home page content ... */}

      {user && user.RoleName === "Admin" && (
        <a href="/admin-dashboard">Admin Dashboard</a>
      )}
    </div>
  );
};

export default HomePage;
