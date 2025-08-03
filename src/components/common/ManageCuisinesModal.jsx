import React, { useState, useEffect } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/ManageCuisinesModal.css';

const ManageCuisinesModal = ({ restaurant, onClose, onCuisinesUpdated }) => {
  const [allCuisines, setAllCuisines] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllCuisines = async () => {
      try {
        const response = await ApiService.getAllCuisines();
        // Filter out cuisines already associated with the restaurant
        const availableCuisines = response.data.filter(
          (cuisine) => !restaurant.cuisines.find((c) => c.id === cuisine.id)
        );
        setAllCuisines(availableCuisines.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error('Error fetching cuisines:', error);
        setError('Failed to load cuisines.');
      }
    };
    fetchAllCuisines();
  }, [restaurant.cuisines]);

  const handleAddCuisine = async () => {
    if (!selectedCuisine) {
      setError('Please select a cuisine to add.');
      return;
    }
    try {
      await ApiService.addCuisineToRestaurant(restaurant.id, selectedCuisine);
      onCuisinesUpdated();
      setSelectedCuisine('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add cuisine.');
    }
  };

  const handleRemoveCuisine = (cuisineId) => {
    // This will now be handled by a separate confirmation modal
    // For now, we'll just log it.
    console.log("Request to remove cuisine:", cuisineId);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Manage Cuisines for {restaurant.name}</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label>Add New Cuisine</label>
          <div className="input-with-button">
            <select value={selectedCuisine} onChange={(e) => setSelectedCuisine(e.target.value)}>
              <option value="">Select a cuisine</option>
              {allCuisines.map(cuisine => (
                <option key={cuisine.id} value={cuisine.id}>{cuisine.name}</option>
              ))}
            </select>
            <button className="btn-confirm-add" onClick={handleAddCuisine}>Add</button>
          </div>
        </div>
        
        <div className="form-group">
          <label>Existing Cuisines</label>
          <ul className="cuisine-list">
            {restaurant.cuisines.map(cuisine => (
              <li key={cuisine.id}>
                {cuisine.name}
                <button className="btn-remove" onClick={() => onCuisinesUpdated(cuisine)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageCuisinesModal;