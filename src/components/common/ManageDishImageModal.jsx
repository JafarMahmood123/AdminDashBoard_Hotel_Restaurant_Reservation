import React, { useState } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/ManageDishImageModal.css';

const ManageDishImageModal = ({ restaurantId, dish, onClose, onImageUploaded }) => {
  const [newImage, setNewImage] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleAddImage = async () => {
    if (!newImage) {
      setError('Please select an image to upload.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('ImageFile', newImage);
      await ApiService.addDishImage(restaurantId, dish.id, formData);
      onImageUploaded();
      setNewImage(null);
      setError('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add image.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Manage Image for {dish.name}</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label>Add New Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/png, image/jpeg"
          />
          <button className="btn-confirm-add" onClick={handleAddImage} disabled={!newImage}>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageDishImageModal;