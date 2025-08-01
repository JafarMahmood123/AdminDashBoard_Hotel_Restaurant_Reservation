import React from 'react';
import '../../assets/styles/ConfirmDeleteAmenityModal.css';

const ConfirmDeleteAmenityModal = ({ amenity, onConfirm, onCancel }) => {
  if (!amenity) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="confirm-modal-content">
        <h3>Are you sure you want to delete this amenity?</h3>
        <div className="amenity-details">
          <p><strong>Name:</strong> {amenity.name}</p>
          <p><strong>Price:</strong> ${amenity.price}</p>
        </div>
        <div className="confirm-modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={() => onConfirm(amenity.id)}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteAmenityModal;