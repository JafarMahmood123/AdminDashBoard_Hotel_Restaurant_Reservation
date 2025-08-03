import React, { useState, useEffect } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/ManageFeaturesModal.css';

const ManageFeaturesModal = ({ restaurant, onClose, onFeaturesUpdated }) => {
  const [allFeatures, setAllFeatures] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState('');
  const [newFeatureName, setNewFeatureName] = useState('');
  const [showNewFeatureForm, setShowNewFeatureForm] = useState(false);
  const [error, setError] = useState('');

  const fetchAllFeatures = async () => {
    try {
      const response = await ApiService.getAllFeatures();
      const availableFeatures = response.data.filter(
        (feature) => !restaurant.features.find((f) => f.id === feature.id)
      );
      setAllFeatures(availableFeatures.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error('Error fetching features:', error);
      setError('Failed to load features.');
    }
  };

  useEffect(() => {
    fetchAllFeatures();
  }, [restaurant.features]);

  const handleAddFeature = async () => {
    setError('');
    try {
      let featureId = selectedFeature;

      if (showNewFeatureForm) {
        if (!newFeatureName.trim()) {
          setError('New feature name cannot be empty.');
          return;
        }
        const response = await ApiService.addFeature({ name: newFeatureName });
        featureId = response.data.id;
      }

      if (!featureId) {
        setError('Please select or create a feature to add.');
        return;
      }

      await ApiService.addFeatureToRestaurant(restaurant.id, featureId);
      onFeaturesUpdated();

      // Reset form state
      setSelectedFeature('');
      setNewFeatureName('');
      setShowNewFeatureForm(false);
      fetchAllFeatures();

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
          {showNewFeatureForm ? (
            <input
              type="text"
              className="feature-input"
              value={newFeatureName}
              onChange={(e) => setNewFeatureName(e.target.value)}
              placeholder="Enter new feature name"
            />
          ) : (
            <select className="feature-input" value={selectedFeature} onChange={(e) => setSelectedFeature(e.target.value)}>
              <option value="">Select a feature</option>
              {allFeatures.map(feature => (
                <option key={feature.id} value={feature.id}>{feature.name}</option>
              ))}
            </select>
          )}
          <div className="actions-container">
            <button type="button" className="btn-link" onClick={() => setShowNewFeatureForm(!showNewFeatureForm)}>
              {showNewFeatureForm ? 'Select Existing Feature' : 'Add New Feature'}
            </button>
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