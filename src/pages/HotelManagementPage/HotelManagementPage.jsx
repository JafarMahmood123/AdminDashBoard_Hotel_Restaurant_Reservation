import React, { useMemo } from 'react';
import Table from '../../components/Table/Table'; // Reusing our Table component
import './HotelManagementPage.css'; // Page-specific styles

// Sample data for hotels - replace with your actual data
const hotels = [
  { id: 1, name: 'The Royal Pinnacle', location: 'Dubai, UAE', rating: 5, status: 'Available' },
  { id: 2, name: 'Sunset Lodge', location: 'Santorini, Greece', rating: 5, status: 'Booked Out' },
  { id: 3, name: 'Mountain Retreat', location: 'Aspen, CO', rating: 4, status: 'Available' },
  { id: 4, name: 'Oceanview Getaway', location: 'Malibu, CA', rating: 4, status: 'Maintenance' },
];

const HotelManagementPage = () => {
  // Define the columns for the hotel table
  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessor: 'name',
      },
      {
        header: 'Location',
        accessor: 'location',
      },
      {
        header: 'Rating',
        accessor: 'rating',
        // Example of custom rendering to add a star icon
        Cell: ({ row }) => <span>{row.rating} ★</span>,
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
            <button className="edit-btn" onClick={() => alert(`Editing hotel ${row.id}`)}>Edit</button>
            <button className="delete-btn" onClick={() => alert(`Deleting hotel ${row.id}`)}>Delete</button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="hotel-management-page">
      <header className="hotel-management-header">
        <h1>Hotel Management</h1>
      </header>

      <div className="toolbar">
        <div className="search-bar">
          <input type="text" placeholder="Search hotels..." />
        </div>
        <button className="add-user-btn">Add New Hotel</button>
      </div>

      <Table columns={columns} data={hotels} />
    </div>
  );
};

export default HotelManagementPage;
