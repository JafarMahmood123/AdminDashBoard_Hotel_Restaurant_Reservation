import React from 'react';
import '../../assets/styles/ConfirmDeleteDishModal.css';

const ConfirmDeleteDishModal = ({ dish, onConfirm, onCancel }) => {
  if (!dish) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="confirm-modal-content">
        <h3>Are you sure you want to delete this dish?</h3>
        <div className="dish-details">
          <p><strong>Name:</strong> {dish.name}</p>
          <p><strong>Description:</strong> {dish.description}</p>
          <p><strong>Price:</strong> ${dish.price}</p>
        </div>
        <div className="confirm-modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={() => onConfirm(dish.id)}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteDishModal;