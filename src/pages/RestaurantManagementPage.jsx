import React, { useState, useEffect } from 'react';
import ApiService from '../api/apiService.jsx';
import Table from '../components/common/Table.jsx';

const RestaurantManagementPage = () => {
  const [restaurants, setRestaurants] = useState([]);

  const fetchRestaurants = async () => {
    try {
      const response = await ApiService.getRestaurants();
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleEdit = (restaurant) => {
    console.log('Editing restaurant:', restaurant);
  };

  const handleDelete = async (restaurant) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await ApiService.deleteRestaurant(restaurant.id);
        fetchRestaurants(); // Refresh the list
      } catch (error) {
        console.error('Error deleting restaurant:', error);
      }
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'cuisine', header: 'Cuisine' },
    { key: 'location', header: 'Location' },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div className="page-container">
      <h2>Restaurant Management</h2>
      <button className="btn-add">Add New Restaurant</button>
      <Table 
        data={restaurants} 
        columns={columns} 
        renderActions={(restaurant) => (
          <>
            <button className="btn-edit" onClick={() => handleEdit(restaurant)}>Edit</button>
            <button className="btn-delete" onClick={() => handleDelete(restaurant)}>Delete</button>
          </>
        )}
      />
    </div>
  );
};

export default RestaurantManagementPage;