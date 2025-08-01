import React from 'react';
import '../../assets/styles/ConfirmDeleteRoomModal.css';

const ConfirmDeleteRoomModal = ({ room, onConfirm, onCancel }) => {
  if (!room) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="confirm-modal-content">
        <h3>Are you sure you want to delete this room?</h3>
        <div className="room-details">
          <p><strong>Room Number:</strong> {room.roomNumber}</p>
          <p><strong>Type:</strong> {room.type}</p>
          <p><strong>Price:</strong> ${room.price}</p>
        </div>
        <div className="confirm-modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={() => onConfirm(room.id)}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteRoomModal;