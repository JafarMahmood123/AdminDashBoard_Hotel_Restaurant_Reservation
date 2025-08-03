import React, { useState, useEffect } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/ManageMealTypesModal.css';

const ManageMealTypesModal = ({ restaurant, onClose, onMealTypesUpdated }) => {
  const [allMealTypes, setAllMealTypes] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllMealTypes = async () => {
      try {
        const response = await ApiService.getAllMealTypes();
        // Filter out meal types already associated with the restaurant
        const availableMealTypes = response.data.filter(
          (mealType) => !restaurant.mealTypes.find((m) => m.id === mealType.id)
        );
        setAllMealTypes(availableMealTypes.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error('Error fetching meal types:', error);
        setError('Failed to load meal types.');
      }
    };
    fetchAllMealTypes();
  }, [restaurant.mealTypes]);

  const handleAddMealType = async () => {
    if (!selectedMealType) {
      setError('Please select a meal type to add.');
      return;
    }
    try {
      await ApiService.addMealTypeToRestaurant(restaurant.id, selectedMealType);
      onMealTypesUpdated();
      setSelectedMealType('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add meal type.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Manage Meal Types for {restaurant.name}</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label>Add New Meal Type</label>
          <div className="input-with-button">
            <select value={selectedMealType} onChange={(e) => setSelectedMealType(e.target.value)}>
              <option value="">Select a meal type</option>
              {allMealTypes.map(mealType => (
                <option key={mealType.id} value={mealType.id}>{mealType.name}</option>
              ))}
            </select>
            <button className="btn-confirm-add" onClick={handleAddMealType}>Add</button>
          </div>
        </div>
        
        <div className="form-group">
          <label>Existing Meal Types</label>
          <ul className="mealtypes-list">
            {restaurant.mealTypes.map(mealType => (
              <li key={mealType.id}>
                {mealType.name}
                <button className="btn-remove" onClick={() => onMealTypesUpdated(mealType)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageMealTypesModal;