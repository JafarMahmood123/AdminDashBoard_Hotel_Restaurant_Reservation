import React, { useState, useEffect } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/ManageRestaurantImagesModal.css';

const ManageRestaurantImagesModal = ({ restaurant, onClose, onImagesUpdated }) => {
  const [images, setImages] = useState(restaurant.images || []);
  const [error, setError] = useState('');
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    setImages(restaurant.images || []);
  }, [restaurant.images]);

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
      await ApiService.addRestaurantImage(restaurant.id, formData);
      onImagesUpdated();
      setNewImage(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add image.');
    }
  };

  const handleRemoveImage = async (imagePath) => {
    try {
      await ApiService.deleteRestaurantImage(imagePath);
      onImagesUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove image.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Manage Images for {restaurant.name}</h2>
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

        <div className="form-group">
          <label>Existing Images</label>
          <div className="image-list">
            {images.map((image) => (
              <div key={image.url} className="image-item">
                <img src={image.url} alt={`Restaurant ${restaurant.name}`} />
                <button className="btn-remove-image" onClick={() => handleRemoveImage(image.path)}>
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRestaurantImagesModal;