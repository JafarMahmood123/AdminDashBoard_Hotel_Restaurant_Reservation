import React from 'react';
import '../../assets/styles/ConfirmDeleteImageModal.css';

const ConfirmDeleteImageModal = ({ image, onConfirm, onCancel }) => {
  if (!image) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="confirm-modal-content">
        <h3>Are you sure you want to delete this image?</h3>
        <div className="confirm-modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={() => onConfirm(image.id)}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteImageModal;