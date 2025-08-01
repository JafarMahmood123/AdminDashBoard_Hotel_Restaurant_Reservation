import React, { useState, useEffect } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/AddHotelAmenityModal.css';

const AddHotelAmenityModal = ({ hotelId, onClose, onAmenityAdded }) => {
  const [allAmenities, setAllAmenities] = useState([]);
  const [selectedAmenity, setSelectedAmenity] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [showNewAmenityForm, setShowNewAmenityForm] = useState(false);
  const [newAmenityName, setNewAmenityName] = useState('');

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await ApiService.getAllAmenities();
        const sortedAmenities = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setAllAmenities(sortedAmenities);
      } catch (error) {
        console.error('Error fetching amenities:', error);
        setError('Failed to load amenities.');
      }
    };
    fetchAmenities();
  }, []);

  const handleAddNewAmenity = async () => {
    if (!newAmenityName.trim()) {
      setError('New amenity name cannot be empty.');
      return;
    }
    try {
      const response = await ApiService.addAmenity({ name: newAmenityName });
      const newAmenity = response.data;
      
      // Add new amenity to the list and sort again
      const updatedAmenities = [...allAmenities, newAmenity].sort((a, b) => a.name.localeCompare(b.name));
      setAllAmenities(updatedAmenities);
      
      // Select the newly added amenity
      setSelectedAmenity(newAmenity.id);
      
      // Reset and hide the form
      setNewAmenityName('');
      setShowNewAmenityForm(false);
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create amenity.';
      setError(errorMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAmenity) {
      setError('Please select an amenity.');
      return;
    }
    try {
      await ApiService.addAmenityToHotel(hotelId, selectedAmenity, parseFloat(price));
      onAmenityAdded();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add amenity to hotel.';
      setError(errorMessage);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Add Amenity to Hotel</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          {!showNewAmenityForm ? (
            <>
              <div className="form-group">
                <label>Amenity</label>
                <select value={selectedAmenity} onChange={(e) => setSelectedAmenity(e.target.value)} required>
                  <option value="">Select an amenity</option>
                  {allAmenities.map(amenity => (
                    <option key={amenity.id} value={amenity.id}>{amenity.name}</option>
                  ))}
                </select>
              </div>
              <button type="button" className="btn-link" onClick={() => setShowNewAmenityForm(true)}>Add New Amenity</button>
            </>
          ) : (
            <div className="form-group">
              <label>New Amenity Name</label>
              <div className="input-with-button">
                <input type="text" value={newAmenityName} onChange={(e) => setNewAmenityName(e.target.value)} placeholder="e.g., Free Parking" />
                <button type="button" className="btn-confirm-add" onClick={handleAddNewAmenity}>Save</button>
              </div>
              <button type="button" className="btn-link" onClick={() => setShowNewAmenityForm(false)}>Cancel</button>
            </div>
          )}
          
          <div className="form-group">
            <label>Price</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required disabled={showNewAmenityForm} />
          </div>

          <button type="submit" className="add-amenity-button" disabled={showNewAmenityForm}>Add to Hotel</button>
        </form>
      </div>
    </div>
  );
};

export default AddHotelAmenityModal;