import React, { useState, useEffect } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/RoomDetailsModal.css';

const RoomDetailsModal = ({ room, onClose }) => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (room) {
      const fetchAmenities = async () => {
        try {
          setLoading(true);
          const response = await ApiService.getAmenitiesByRoomId(room.id);
          setAmenities(response.data);
        } catch (error) {
          console.error('Error fetching amenities:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchAmenities();
    }
  }, [room]);

  if (!room) {
    return null;
  }

  // Close the modal if the overlay is clicked
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Room Details</h2>
        <div className="room-details">
          <p><strong>Room Number:</strong> {room.roomNumber}</p>
          <p><strong>Max Occupancy:</strong> {room.maxOccupancy}</p>
          <p><strong>Description:</strong> {room.description}</p>
          <p><strong>Price:</strong> ${room.price}</p>
          <p><strong>Type:</strong> {room.type}</p>
        </div>
        <h3>Amenities</h3>
        {loading ? (
          <p>Loading amenities...</p>
        ) : (
          <ul>
            {amenities.map(amenity => (
              <li key={amenity.id}>{amenity.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RoomDetailsModal;