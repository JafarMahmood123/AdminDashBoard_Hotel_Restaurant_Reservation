import React, { useState, useEffect } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/ManageFeaturesModal.css';

const ManageFeaturesModal = ({ restaurant, onClose, onFeaturesUpdated }) => {
  const [allFeatures, setAllFeatures] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllFeatures = async () => {
      try {
        const response = await ApiService.getAllFeatures();
        // Filter out features already associated with the restaurant
        const availableFeatures = response.data.filter(
          (feature) => !restaurant.features.find((f) => f.id === feature.id)
        );
        setAllFeatures(availableFeatures.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error('Error fetching features:', error);
        setError('Failed to load features.');
      }
    };
    fetchAllFeatures();
  }, [restaurant.features]);

  const handleAddFeature = async () => {
    if (!selectedFeature) {
      setError('Please select a feature to add.');
      return;
    }
    try {
      await ApiService.addFeatureToRestaurant(restaurant.id, selectedFeature);
      onFeaturesUpdated();
      setSelectedFeature('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add feature.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Manage Features for {restaurant.name}</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label>Add New Feature</label>
          <div className="input-with-button">
            <select value={selectedFeature} onChange={(e) => setSelectedFeature(e.target.value)}>
              <option value="">Select a feature</option>
              {allFeatures.map(feature => (
                <option key={feature.id} value={feature.id}>{feature.name}</option>
              ))}
            </select>
            <button className="btn-confirm-add" onClick={handleAddFeature}>Add</button>
          </div>
        </div>
        
        <div className="form-group">
          <label>Existing Features</label>
          <ul className="feature-list">
            {restaurant.features.map(feature => (
              <li key={feature.id}>
                {feature.name}
                <button className="btn-remove" onClick={() => onFeaturesUpdated(feature)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageFeaturesModal;