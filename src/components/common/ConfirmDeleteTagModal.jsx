import React from 'react';
import '../../assets/styles/ConfirmDeleteTagModal.css';

const ConfirmDeleteTagModal = ({ tag, onConfirm, onCancel }) => {
  if (!tag) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="confirm-modal-content">
        <h3>Are you sure you want to remove this tag?</h3>
        <p><strong>{tag.name}</strong> will be removed from this restaurant.</p>
        <div className="confirm-modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={() => onConfirm(tag.id)}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteTagModal;