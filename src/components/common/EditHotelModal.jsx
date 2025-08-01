import React, { useState, useEffect, useCallback } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/EditHotelModal.css';
import MapSelector from './MapSelector';

const EditHotelModal = ({ hotel, onClose, onHotelUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    url: '',
    countryId: '',
    cityId: '',
    localLocationId: '',
  });
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [localLocations, setLocalLocations] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name || '',
        description: hotel.description || '',
        latitude: hotel.latitude || '',
        longitude: hotel.longitude || '',
        url: hotel.url || '',
        countryId: hotel.countryId || '',
        cityId: hotel.cityId || '',
        localLocationId: hotel.localLocationId || '',
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
  }, [hotel]);

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

  useEffect(() => {
    const fetchLocalLocations = async () => {
      if (formData.cityId) {
        try {
          const response = await ApiService.getLocalLocationsByCity(formData.cityId);
          setLocalLocations(response.data);
        } catch (error) {
          console.error('Error fetching local locations:', error);
          setError('Failed to load local locations for the selected city.');
        }
      } else {
        setLocalLocations([]);
      }
    };
    fetchLocalLocations();
  }, [formData.cityId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleLocationSelect = useCallback(({ lat, lng }) => {
    setFormData(prevFormData => ({ ...prevFormData, latitude: lat, longitude: lng }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
        const locationResponse = await ApiService.getLocationId(formData.countryId, formData.cityId, formData.localLocationId);
        const locationId = locationResponse.data;

        const updatedHotel = {
            name: formData.name,
            description: formData.description,
            latitude: formData.latitude,
            longitude: formData.longitude,
            url: formData.url,
            locationId: locationId
        }

        await ApiService.updateHotel(hotel.id, updatedHotel);
        onHotelUpdated();
        onClose();

    } catch(err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to update hotel.';
        setError(errorMessage);
        console.error('Update hotel error:', err);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Edit Hotel</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Location</label>
            <MapSelector onLocationSelect={handleLocationSelect} />
            <div className="coordinates-display">
                Latitude: {formData.latitude || 'N/A'}, Longitude: {formData.longitude || 'N/A'}
            </div>
          </div>
          <div className="form-group">
            <label>URL (Optional)</label>
            <input type="url" name="url" value={formData.url} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Country</label>
            <select name="countryId" value={formData.countryId} onChange={handleChange} required>
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
          <div className="form-group">
            <label>Local Location</label>
            <select name="localLocationId" value={formData.localLocationId} onChange={handleChange} disabled={!formData.cityId}>
              <option value="">Select a local location</option>
              {localLocations.map(location => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="update-hotel-button" disabled={isSubmitting}>
            {isSubmitting ? 'Updating Hotel...' : 'Update Hotel'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditHotelModal;