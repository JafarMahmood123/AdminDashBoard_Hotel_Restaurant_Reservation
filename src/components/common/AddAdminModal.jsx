import React, { useState, useEffect } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/AddAdminModal.css';

const AddAdminModal = ({ onClose, onAdminAdded }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
    locationId: '',
  });
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [localLocations, setLocalLocations] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedLocalLocation, setSelectedLocalLocation] = useState('');
  const [newLocalLocation, setNewLocalLocation] = useState('');
  const [showNewLocalLocationInput, setShowNewLocalLocationInput] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await ApiService.getCountries();
        setCountries(response.data);
      } catch (err) {
        setError('Failed to load countries.');
      }
    };
    fetchCountries();
  }, []);

  const handleCountryChange = async (e) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);
    setSelectedCity('');
    setSelectedLocalLocation('');
    setLocalLocations([]);
    if (countryId) {
      try {
        const response = await ApiService.getCitiesByCountry(countryId);
        setCities(response.data);
      } catch (err) {
        setError('Failed to load cities.');
      }
    } else {
      setCities([]);
    }
  };

  const handleCityChange = async (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    setSelectedLocalLocation('');
    if (cityId) {
      try {
        const response = await ApiService.getLocalLocationsByCity(cityId);
        setLocalLocations(response.data);
      } catch (err) {
        setError('Failed to load local locations.');
      }
    } else {
      setLocalLocations([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let finalLocalLocationId = selectedLocalLocation;

      if (showNewLocalLocationInput && newLocalLocation.trim()) {
        const newLocResponse = await ApiService.addLocalLocation({ cityId: selectedCity, name: newLocalLocation });
        finalLocalLocationId = newLocResponse.data.id;
      }

      // First, get the location ID
      const locationResponse = await ApiService.getLocationId(selectedCountry, selectedCity, finalLocalLocationId);
      const locationId = locationResponse.data;

      const adminData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        birthDate: formData.birthDate,
        locationId: locationId,
      };

      await ApiService.addAdmin(adminData);
      onAdminAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add admin. Please try again.');
    }
  };
  
    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Add New Admin</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <select value={selectedCountry} onChange={handleCountryChange} required>
              <option value="">Select a country</option>
              {countries.map(country => (
                <option key={country.id} value={country.id}>{country.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>City</label>
            <select value={selectedCity} onChange={handleCityChange} disabled={!selectedCountry} required>
              <option value="">Select a city</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Local Location</label>
            <select value={selectedLocalLocation} onChange={(e) => setSelectedLocalLocation(e.target.value)} disabled={!selectedCity || showNewLocalLocationInput}>
              <option value="">Select a local location (optional)</option>
              {localLocations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
            <button type="button" className="btn-add-new" onClick={() => setShowNewLocalLocationInput(!showNewLocalLocationInput)} disabled={!selectedCity}>
              {showNewLocalLocationInput ? 'Cancel' : 'Add New'}
            </button>
          </div>
          {showNewLocalLocationInput && (
            <div className="form-group">
              <label>New Local Location</label>
              <input
                type="text"
                value={newLocalLocation}
                onChange={(e) => setNewLocalLocation(e.target.value)}
                placeholder="New location name"
              />
            </div>
          )}
          <div className="form-actions">
            <button type="submit" className="btn-confirm">Add Admin</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminModal;
