import React, { useState, useEffect } from 'react';
import ApiService from '../../api/apiService';
import 'C:/Users/Jafar Mahmood/admin-dashboard/src/assets/styles/AddUserModal.css';

const AddUserModal = ({ onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
    countryId: '',
    cityId: '',
  });
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch countries when the modal mounts
    const fetchCountries = async () => {
      try {
        const response = await ApiService.getCountries();
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setError('Failed to load countries.');
      }
    };
    fetchCountries();
  }, []);

  const handleCountryChange = async (e) => {
    const countryId = e.target.value;
    setFormData({ ...formData, countryId, cityId: '' }); // Reset city on country change
    if (countryId) {
      try {
        const response = await ApiService.getCitiesByCountry(countryId);
        setCities(response.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setError('Failed to load cities for the selected country.');
      }
    } else {
      setCities([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.countryId || !formData.cityId) {
        setError('Please select a country and city.');
        return;
    }

    try {
      // Step 1: Get the location ID from the backend
      const locationResponse = await ApiService.getLocationId(formData.countryId, formData.cityId);
      const locationId = locationResponse.data;

      // Step 2: Prepare user data with the locationId
      const newUser = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        birthDate: formData.birthDate,
        locationId: locationId,
      };

      // Step 3: Send the request to add the new user
      await ApiService.addUser(newUser);

      // Notify the parent component that a user has been added
      onUserAdded();
      onClose(); // Close the modal on success
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add user.';
      setError(errorMessage);
      console.error('Add user error:', err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Add New User</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Birth Date</label>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Country</label>
            <select name="countryId" value={formData.countryId} onChange={handleCountryChange} required>
              <option value="">Select a country</option>
              {countries.map(country => (
                <option key={country.id} value={country.id}>{country.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>City</label>
            <select name="cityId" value={formData.cityId} onChange={handleChange} required disabled={!formData.countryId}>
              <option value="">Select a city</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="add-user-button">Add User</button>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
