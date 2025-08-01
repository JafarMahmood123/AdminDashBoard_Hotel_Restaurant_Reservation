import React from 'react';
import '../../assets/styles/ConfirmDeleteHotelModal.css';

const ConfirmDeleteHotelModal = ({ hotel, onConfirm, onCancel }) => {
  if (!hotel) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="confirm-modal-content">
        <h3>Are you sure you want to delete this hotel?</h3>
        <div className="hotel-details">
          <p><strong>Name:</strong> {hotel.name}</p>
          <p><strong>Description:</strong> {hotel.description}</p>
          <p><strong>Location:</strong> {hotel.location}</p>
          <p><strong>Rooms:</strong> {hotel.numberOfRooms}</p>
          <p><strong>Price Range:</strong> {hotel.priceRange}</p>
        </div>
        <div className="confirm-modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={() => onConfirm(hotel.id)}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteHotelModal;