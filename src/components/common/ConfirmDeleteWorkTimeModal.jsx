import React from 'react';
import '../../assets/styles/ConfirmDeleteWorkTimeModal.css';

const ConfirmDeleteWorkTimeModal = ({ workTime, onConfirm, onCancel }) => {
  if (!workTime) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="confirm-modal-content">
        <h3>Are you sure you want to remove this work time?</h3>
        <p><strong>{workTime.dayOfWeek}: {workTime.openingTime} - {workTime.closingTime}</strong> will be removed.</p>
        <div className="confirm-modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={() => onConfirm(workTime.id)}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteWorkTimeModal;