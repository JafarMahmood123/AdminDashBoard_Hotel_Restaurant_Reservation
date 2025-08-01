import React, { useState, useEffect } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/EditRoomModal.css';

const EditRoomModal = ({ room, hotelId, onClose, onRoomUpdated }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    maxOccupancy: '',
    description: '',
    price: '',
    roomTypeId: '',
  });
  const [roomTypes, setRoomTypes] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewRoomTypeForm, setShowNewRoomTypeForm] = useState(false);
  const [newRoomTypeDescription, setNewRoomTypeDescription] = useState('');

  useEffect(() => {
    if (room) {
      setFormData({
        roomNumber: room.roomNumber || '',
        maxOccupancy: room.maxOccupancy || '',
        description: room.description || '',
        price: room.price || '',
        roomTypeId: room.roomTypeId || '',
      });
    }

    const fetchRoomTypes = async () => {
      try {
        const response = await ApiService.getRoomTypes();
        setRoomTypes(response.data);
      } catch (error) {
        console.error('Error fetching room types:', error);
        setError('Failed to load room types.');
      }
    };
    fetchRoomTypes();
  }, [room]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    let finalFormData = { ...formData };

    try {
      // If the user is creating a new room type
      if (showNewRoomTypeForm && newRoomTypeDescription.trim()) {
        const newRoomTypeResponse = await ApiService.addRoomType(newRoomTypeDescription);
        finalFormData.roomTypeId = newRoomTypeResponse.data.id;
      }

      if (!finalFormData.roomTypeId) {
        setError('Please select or create a room type.');
        setIsSubmitting(false);
        return;
      }

      await ApiService.updateRoomForHotel(hotelId, room.id, finalFormData);
      onRoomUpdated();
      onClose();
    } catch(err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to update room.';
        setError(errorMessage);
        console.error('Update room error:', err);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Edit Room</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Room Number</label>
            <input type="number" name="roomNumber" value={formData.roomNumber} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Max Occupancy</label>
            <input type="number" name="maxOccupancy" value={formData.maxOccupancy} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Room Type</label>
            {!showNewRoomTypeForm ? (
              <>
                <select name="roomTypeId" value={formData.roomTypeId} onChange={handleChange} required>
                  <option value="">Select a room type</option>
                  {roomTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.description}</option>
                  ))}
                </select>
                <button type="button" className="btn-link" onClick={() => setShowNewRoomTypeForm(true)}>Add New Room Type</button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={newRoomTypeDescription}
                  onChange={(e) => setNewRoomTypeDescription(e.target.value)}
                  placeholder="Enter new room type description"
                  required
                />
                <button type="button" className="btn-link" onClick={() => setShowNewRoomTypeForm(false)}>Cancel</button>
              </>
            )}
          </div>
          <button type="submit" className="update-room-button" disabled={isSubmitting}>
            {isSubmitting ? 'Updating Room...' : 'Update Room'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditRoomModal;