import React, { useState } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/ManageWorkTimesModal.css';

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const ManageWorkTimesModal = ({ restaurant, onClose, onWorkTimesUpdated }) => {
  const [formData, setFormData] = useState({
    dayOfWeek: 'Monday',
    openingTime: '',
    closingTime: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddWorkTime = async () => {
    if (!formData.openingTime || !formData.closingTime) {
      setError('Please provide both an opening and closing time.');
      return;
    }
    try {
      // Step 1: Create the new work time entry with formatted time and string for the day
      const workTimePayload = {
        day: formData.dayOfWeek,
        openHour: `${formData.openingTime}:00`,
        closeHour: `${formData.closingTime}:00`,
      };
      const workTimeResponse = await ApiService.addWorkTime(workTimePayload);
      const newWorkTimeId = workTimeResponse.data.id;

      // Step 2: Associate the new work time with the restaurant
      await ApiService.addWorkTimeToRestaurant(restaurant.id, newWorkTimeId);
      
      onWorkTimesUpdated();
      setFormData({ dayOfWeek: 'Monday', openingTime: '', closingTime: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add work time.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Manage Work Times for {restaurant.name}</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label>Day of the Week</label>
          <select name="dayOfWeek" value={formData.dayOfWeek} onChange={handleChange}>
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
            <option>Sunday</option>
          </select>
        </div>
        <div className="form-group">
          <label>Opening Time</label>
          <input type="time" name="openingTime" value={formData.openingTime} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Closing Time</label>
          <input type="time" name="closingTime" value={formData.closingTime} onChange={handleChange} required />
        </div>
        <button className="btn-confirm-add" onClick={handleAddWorkTime}>Add Work Time</button>
        
        <div className="form-group">
          <label>Existing Work Times</label>
          <ul className="worktime-list">
            {restaurant.workTimes.map(workTime => (
              <li key={workTime.id}>
                <span>{dayNames[workTime.dayOfWeek]}: {workTime.openingTime} - {workTime.closingTime}</span>
                <button className="btn-remove" onClick={() => onWorkTimesUpdated(workTime)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageWorkTimesModal;