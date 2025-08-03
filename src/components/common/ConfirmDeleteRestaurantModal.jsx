import React from 'react';
import '../../assets/styles/ConfirmDeleteRestaurantModal.css';

const ConfirmDeleteRestaurantModal = ({ restaurant, onConfirm, onCancel }) => {
  if (!restaurant) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="confirm-modal-content">
        <h3>Are you sure you want to delete this restaurant?</h3>
        <div className="restaurant-details">
          <p><strong>Name:</strong> {restaurant.name}</p>
          <p><strong>Description:</strong> {restaurant.description}</p>
          <p><strong>Location:</strong> {restaurant.location}</p>
          <p><strong>Star Rating:</strong> {restaurant.starRating}</p>
          <p><strong>Tables:</strong> {restaurant.numberOfTables}</p>
          <p><strong>Price Level:</strong> {restaurant.priceLevel}</p>
          <p><strong>Price Range:</strong> {restaurant.priceRange}</p>
        </div>
        <div className="confirm-modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={() => onConfirm(restaurant.id)}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteRestaurantModal;