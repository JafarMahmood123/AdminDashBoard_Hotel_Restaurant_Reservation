import React, { useState, useEffect } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/ManageTagsModal.css';

const ManageTagsModal = ({ restaurant, onClose, onTagsUpdated }) => {
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [showNewTagForm, setShowNewTagForm] = useState(false);
  const [error, setError] = useState('');

  const fetchAllTags = async () => {
    try {
      const response = await ApiService.getAllTags();
      const availableTags = response.data.filter(
        (tag) => !restaurant.tags.find((t) => t.id === tag.id)
      );
      setAllTags(availableTags.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error('Error fetching tags:', error);
      setError('Failed to load tags.');
    }
  };

  useEffect(() => {
    fetchAllTags();
  }, [restaurant.tags]);

  const handleAddTag = async () => {
    setError('');
    try {
      let tagId = selectedTag;

      if (showNewTagForm) {
        if (!newTagName.trim()) {
          setError('New tag name cannot be empty.');
          return;
        }
        const response = await ApiService.addTag({ name: newTagName });
        tagId = response.data.id;
      }

      if (!tagId) {
        setError('Please select or create a tag to add.');
        return;
      }

      await ApiService.addTagToRestaurant(restaurant.id, tagId);
      onTagsUpdated();

      // Reset form state
      setSelectedTag('');
      setNewTagName('');
      setShowNewTagForm(false);
      fetchAllTags();

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
          {showNewTagForm ? (
            <input
              type="text"
              className="tag-input"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter new tag name"
            />
          ) : (
            <select className="tag-input" value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
              <option value="">Select a tag</option>
              {allTags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
          )}
          <div className="actions-container">
            <button type="button" className="btn-link" onClick={() => setShowNewTagForm(!showNewTagForm)}>
              {showNewTagForm ? 'Select Existing Tag' : 'Add New Tag'}
            </button>
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