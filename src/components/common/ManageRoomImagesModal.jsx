import React, { useState, useEffect } from 'react';
import ApiService, { API_URL } from '../../api/apiService';
import '../../assets/styles/ManageRoomImagesModal.css';

const ManageRoomImagesModal = ({ room, onClose, onImagesUpdated }) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [newImage, setNewImage] = useState(null);

  const fetchImages = async () => {
    try {
      const response = await ApiService.getRoomImages(room.id);
      setImages(response.data.map(imagePath => ({
        url: `${API_URL}${imagePath}`,
        path: imagePath
      })));
    } catch (err) {
      setError('Failed to load images.');
    }
  };

  useEffect(() => {
    if (room) {
      fetchImages();
    }
  }, [room]);

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
      await ApiService.addRoomImage(room.id, formData);
      onImagesUpdated();
      setNewImage(null);
      setError('');
      fetchImages(); // Refresh images after upload
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add image.');
    }
  };

  const handleRemoveImage = async (imagePath) => {
    try {
      await ApiService.deleteRoomImage(imagePath);
      onImagesUpdated();
      fetchImages(); // Refresh images after deletion
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove image.');
    }
  };

  if (!room) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Manage Images for Room {room.roomNumber}</h2>
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
                <img src={image.url} alt={`Room ${room.roomNumber}`} />
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

export default ManageRoomImagesModal;
