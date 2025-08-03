import React, { useState, useEffect } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/ManageCuisinesModal.css';

const ManageCuisinesModal = ({ restaurant, onClose, onCuisinesUpdated }) => {
  const [allCuisines, setAllCuisines] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [newCuisineName, setNewCuisineName] = useState('');
  const [showNewCuisineForm, setShowNewCuisineForm] = useState(false);
  const [error, setError] = useState('');

  const fetchAllCuisines = async () => {
    try {
      const response = await ApiService.getAllCuisines();
      const availableCuisines = response.data.filter(
        (cuisine) => !restaurant.cuisines.find((c) => c.id === cuisine.id)
      );
      setAllCuisines(availableCuisines.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error('Error fetching cuisines:', error);
      setError('Failed to load cuisines.');
    }
  };

  useEffect(() => {
    fetchAllCuisines();
  }, [restaurant.cuisines]);

  const handleAddCuisine = async () => {
    setError('');
    try {
      let cuisineId = selectedCuisine;

      if (showNewCuisineForm) {
        if (!newCuisineName.trim()) {
          setError('New cuisine name cannot be empty.');
          return;
        }
        const response = await ApiService.addCuisine({ name: newCuisineName });
        cuisineId = response.data.id;
      }

      if (!cuisineId) {
        setError('Please select or create a cuisine to add.');
        return;
      }

      await ApiService.addCuisineToRestaurant(restaurant.id, cuisineId);
      onCuisinesUpdated();

      // Reset form state
      setSelectedCuisine('');
      setNewCuisineName('');
      setShowNewCuisineForm(false);
      fetchAllCuisines();

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add cuisine.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Manage Cuisines for {restaurant.name}</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label>Add New Cuisine</label>
          {showNewCuisineForm ? (
            <input
              type="text"
              className="cuisine-input"
              value={newCuisineName}
              onChange={(e) => setNewCuisineName(e.target.value)}
              placeholder="Enter new cuisine name"
            />
          ) : (
            <select className="cuisine-input" value={selectedCuisine} onChange={(e) => setSelectedCuisine(e.target.value)}>
              <option value="">Select a cuisine</option>
              {allCuisines.map(cuisine => (
                <option key={cuisine.id} value={cuisine.id}>{cuisine.name}</option>
              ))}
            </select>
          )}
          <div className="actions-container">
            <button type="button" className="btn-link" onClick={() => setShowNewCuisineForm(!showNewCuisineForm)}>
              {showNewCuisineForm ? 'Select Existing Cuisine' : 'Add New Cuisine'}
            </button>
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