import React from 'react';
import '../../assets/styles/ConfirmDeleteMealTypeModal.css';

const ConfirmDeleteMealTypeModal = ({ mealType, onConfirm, onCancel }) => {
  if (!mealType) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="confirm-modal-content">
        <h3>Are you sure you want to remove this meal type?</h3>
        <p><strong>{mealType.name}</strong> will be removed from this restaurant.</p>
        <div className="confirm-modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={() => onConfirm(mealType.id)}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteMealTypeModal;