import React, { useState, useEffect } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/AddDishModal.css';

const AddDishModal = ({ restaurantId, onClose, onDishAdded }) => {
  const [allDishes, setAllDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState('');
  const [newDishName, setNewDishName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');
  const [error, setError] = useState('');
  const [showNewDishForm, setShowNewDishForm] = useState(false);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await ApiService.getAllDishes();
        const sortedDishes = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setAllDishes(sortedDishes);
      } catch (error) {
        console.error('Error fetching dishes:', error);
        setError('Failed to load dishes.');
      }
    };
    fetchDishes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let dishId = selectedDish;

    try {
      if (showNewDishForm) {
        if (!newDishName.trim()) {
          setError('New dish name cannot be empty.');
          return;
        }
        const response = await ApiService.addDish({ name: newDishName });
        dishId = response.data.id;
      }

      if (!dishId) {
        setError('Please select or create a dish.');
        return;
      }

      await ApiService.addDishToRestaurant(restaurantId, {
        dishId,
        description,
        price: parseFloat(price),
        pictureUrl,
      });
      
      onDishAdded();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add dish to restaurant.';
      setError(errorMessage);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Add Dish to Restaurant</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          {!showNewDishForm ? (
            <>
              <div className="form-group">
                <label>Dish</label>
                <select value={selectedDish} onChange={(e) => setSelectedDish(e.target.value)} required>
                  <option value="">Select a dish</option>
                  {allDishes.map(dish => (
                    <option key={dish.id} value={dish.id}>{dish.name}</option>
                  ))}
                </select>
              </div>
              <button type="button" className="btn-link" onClick={() => setShowNewDishForm(true)}>Add New Dish</button>
            </>
          ) : (
            <div className="form-group">
              <label>New Dish Name</label>
              <div className="input-with-button">
                <input type="text" value={newDishName} onChange={(e) => setNewDishName(e.target.value)} placeholder="e.g., Spaghetti Carbonara" />
              </div>
              <button type="button" className="btn-link" onClick={() => setShowNewDishForm(false)}>Cancel</button>
            </div>
          )}
          
          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Picture URL (Optional)</label>
            <input type="url" value={pictureUrl} onChange={(e) => setPictureUrl(e.target.value)} />
          </div>

          <button type="submit" className="add-dish-button">Add to Restaurant</button>
        </form>
      </div>
    </div>
  );
};

export default AddDishModal;