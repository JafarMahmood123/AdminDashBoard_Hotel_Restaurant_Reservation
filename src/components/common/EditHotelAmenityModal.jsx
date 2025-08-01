import React, { useState, useEffect } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/EditHotelAmenityModal.css';

const EditHotelAmenityModal = ({ amenity, hotelId, onClose, onAmenityUpdated }) => {
  const [newPrice, setNewPrice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (amenity) {
      setNewPrice(amenity.price);
    }
  }, [amenity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ApiService.updateAmenityForHotel(hotelId, amenity.id, parseFloat(newPrice));
      onAmenityUpdated();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update amenity price.';
      setError(errorMessage);
      console.error('Update amenity error:', err);
    }
  };

  if (!amenity) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Edit Amenity Price</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Amenity</label>
            <p>{amenity.name}</p>
          </div>
          <div className="form-group">
            <label>Current Price</label>
            <p>${amenity.price}</p>
          </div>
          <div className="form-group">
            <label>New Price</label>
            <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required />
          </div>
          <button type="submit" className="update-amenity-button">Confirm Edit</button>
        </form>
      </div>
    </div>
  );
};

export default EditHotelAmenityModal;