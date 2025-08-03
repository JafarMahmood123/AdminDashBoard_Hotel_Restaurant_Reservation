import React, { useState, useEffect } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/ManageTagsModal.css';

const ManageTagsModal = ({ restaurant, onClose, onTagsUpdated }) => {
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const response = await ApiService.getAllTags();
        // Filter out tags already associated with the restaurant
        const availableTags = response.data.filter(
          (tag) => !restaurant.tags.find((t) => t.id === tag.id)
        );
        setAllTags(availableTags.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error('Error fetching tags:', error);
        setError('Failed to load tags.');
      }
    };
    fetchAllTags();
  }, [restaurant.tags]);

  const handleAddTag = async () => {
    if (!selectedTag) {
      setError('Please select a tag to add.');
      return;
    }
    try {
      await ApiService.addTagToRestaurant(restaurant.id, selectedTag);
      onTagsUpdated();
      setSelectedTag('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add tag.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Manage Tags for {restaurant.name}</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label>Add New Tag</label>
          <div className="input-with-button">
            <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
              <option value="">Select a tag</option>
              {allTags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
            <button className="btn-confirm-add" onClick={handleAddTag}>Add</button>
          </div>
        </div>
        
        <div className="form-group">
          <label>Existing Tags</label>
          <ul className="tag-list">
            {restaurant.tags.map(tag => (
              <li key={tag.id}>
                {tag.name}
                <button className="btn-remove" onClick={() => onTagsUpdated(tag)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageTagsModal;