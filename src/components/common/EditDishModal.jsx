import React, { useState, useEffect } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/EditDishModal.css';

const EditDishModal = ({ dish, restaurantId, onClose, onDishUpdated }) => {
  const [formData, setFormData] = useState({
    description: '',
    price: '',
    pictureUrl: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (dish) {
      setFormData({
        description: dish.description || '',
        price: dish.price || '',
        pictureUrl: dish.pictureUrl || '',
      });
    }
  }, [dish]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const updatedDishData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      await ApiService.updateDishForRestaurant(restaurantId, dish.id, updatedDishData);
      onDishUpdated();
      onClose();
    } catch(err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to update dish.';
        setError(errorMessage);
        console.error('Update dish error:', err);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!dish) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Edit Dish: {dish.name}</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Picture URL (Optional)</label>
            <input type="url" name="pictureUrl" value={formData.pictureUrl} onChange={handleChange} />
          </div>
          <button type="submit" className="update-dish-button" disabled={isSubmitting}>
            {isSubmitting ? 'Updating Dish...' : 'Update Dish'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDishModal;