import React from 'react';
import '../../assets/styles/ConfirmDeleteCuisineModal.css';

const ConfirmDeleteCuisineModal = ({ cuisine, onConfirm, onCancel }) => {
  if (!cuisine) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="confirm-modal-content">
        <h3>Are you sure you want to remove this cuisine?</h3>
        <p><strong>{cuisine.name}</strong> will be removed from this restaurant.</p>
        <div className="confirm-modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={() => onConfirm(cuisine.id)}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteCuisineModal;