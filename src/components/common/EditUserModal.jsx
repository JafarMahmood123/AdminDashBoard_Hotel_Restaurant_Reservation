import React, { useState, useEffect } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/EditUserModal.css';

const EditUserModal = ({ user, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    countryId: '',
    cityId: '',
  });
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        birthDate: user.birthDate ? user.birthDate.split('T')[0] : '',
        countryId: user.countryId || '',
        cityId: user.cityId || '',
      });
    }

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
  }, [user]);

  useEffect(() => {
    const fetchCities = async () => {
      if (formData.countryId) {
        try {
          const response = await ApiService.getCitiesByCountry(formData.countryId);
          setCities(response.data);
        } catch (error) {
          console.error('Error fetching cities:', error);
          setError('Failed to load cities for the selected country.');
        }
      } else {
        setCities([]);
      }
    };
    fetchCities();
  }, [formData.countryId]);


  const handleCountryChange = async (e) => {
    const countryId = e.target.value;
    setFormData({ ...formData, countryId, cityId: '' }); 
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
      const locationResponse = await ApiService.getLocationId(formData.countryId, formData.cityId);
      const locationId = locationResponse.data;

      const updatedUser = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        locationId: locationId,
      };

      await ApiService.updateUser(user.id, updatedUser);

      onUserUpdated();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update user.';
      setError(errorMessage);
      console.error('Update user error:', err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Edit User</h2>
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
          <button type="submit" className="update-user-button">Update User</button>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
