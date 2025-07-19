import React, { useMemo } from 'react';
import Table from '../../components/Table/Table'; // Reusing our Table component
import './RestaurantManagementPage.css'; // Page-specific styles

// Sample data for restaurants - replace with your actual data
const restaurants = [
  { id: 1, name: 'The Grand Eatery', cuisine: 'Italian', location: 'New York, NY', status: 'Open' },
  { id: 2, name: 'Spicy Dragon', cuisine: 'Chinese', location: 'San Francisco, CA', status: 'Open' },
  { id: 3, name: 'La Brasserie', cuisine: 'French', location: 'Paris, France', status: 'Closed' },
  { id: 4, name: 'Taco Fiesta', cuisine: 'Mexican', location: 'Los Angeles, CA', status: 'Open' },
];

const RestaurantManagementPage = () => {
  // Define the columns for the restaurant table
  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessor: 'name',
      },
      {
        header: 'Cuisine',
        accessor: 'cuisine',
      },
      {
        header: 'Location',
        accessor: 'location',
      },
      {
        header: 'Status',
        accessor: 'status',
      },
      {
        header: 'Actions',
        accessor: 'actions',
        // Use a custom Cell renderer for the action buttons
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button className="edit-btn" onClick={() => alert(`Editing restaurant ${row.id}`)}>Edit</button>
            <button className="delete-btn" onClick={() => alert(`Deleting restaurant ${row.id}`)}>Delete</button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="restaurant-management-page">
      <header className="restaurant-management-header">
        <h1>Restaurant Management</h1>
      </header>

      <div className="toolbar">
        <div className="search-bar">
          <input type="text" placeholder="Search restaurants..." />
        </div>
        <button className="add-user-btn">Add New Restaurant</button>
      </div>

      <Table columns={columns} data={restaurants} />
    </div>
  );
};

export default RestaurantManagementPage;
