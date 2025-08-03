import React from 'react';
import '../../assets/styles/ConfirmDeleteFeatureModal.css';

const ConfirmDeleteFeatureModal = ({ feature, onConfirm, onCancel }) => {
  if (!feature) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="confirm-modal-content">
        <h3>Are you sure you want to remove this feature?</h3>
        <p><strong>{feature.name}</strong> will be removed from this restaurant.</p>
        <div className="confirm-modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={() => onConfirm(feature.id)}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteFeatureModal;