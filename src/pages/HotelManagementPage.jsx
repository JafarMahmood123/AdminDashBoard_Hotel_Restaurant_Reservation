import React, { useState, useEffect } from 'react';
import ApiService from 'C:/Users/Jafar Mahmood/admin-dashboard/src/api/apiService.jsx';
import Table from 'C:/Users/Jafar Mahmood/admin-dashboard/src/components/common/Table.jsx';

const HotelManagementPage = () => {
  const [hotels, setHotels] = useState([]);

  const fetchHotels = async () => {
    try {
      const response = await ApiService.getHotels();
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleEdit = (hotel) => {
    console.log('Editing hotel:', hotel);
  };

  const handleDelete = async (hotelId) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await ApiService.deleteHotel(hotelId);
        fetchHotels(); // Refresh the list
      } catch (error) {
        console.error('Error deleting hotel:', error);
      }
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'location', header: 'Location' },
    { key: 'rating', header: 'Rating' },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div className="page-container">
      <h2>Hotel Management</h2>
      <button className="btn-add">Add New Hotel</button>
      <Table data={hotels} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default HotelManagementPage;
