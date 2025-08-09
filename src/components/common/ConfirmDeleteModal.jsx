import React from 'react';
import '../../assets/styles/ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ user, onConfirm, onCancel }) => {
  if (!user) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="confirm-modal-content">
        <h3>Are you sure you want to delete this user?</h3>
        <div className="user-details" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
        <div className="confirm-modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={() => onConfirm(user.id)}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;