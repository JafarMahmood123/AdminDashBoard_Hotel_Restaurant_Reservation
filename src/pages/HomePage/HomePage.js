import React from "react";

const HomePage = ({ user }) => {
  return (
    <div>
      {/* here we will have the navigation bar */}
      <h1>Welcome to the Hotel, Restaurant, and Reservation System</h1>

      <div>
          <div>
            <button type="submit">User Management</button>
          </div>
          <div>
            <button type="submit">Restaurant Management</button>
          </div>
          <div>
            <button type="submit">Hotel Management</button>
          </div>
          <div>
            <button type="submit">Event Management</button>
          </div>
      </div>
    </div>
  );
};

export default HomePage;
