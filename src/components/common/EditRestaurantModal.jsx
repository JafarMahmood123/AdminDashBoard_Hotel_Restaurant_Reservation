import React, { useState, useEffect, useCallback } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/EditRestaurantModal.css';
import MapSelector from './MapSelector';

const EditRestaurantModal = ({ restaurant, onClose, onRestaurantUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    pictureUrl: '',
    latitude: '',
    longitude: '',
    numberOfTables: '',
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
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        description: restaurant.description || '',
        url: restaurant.url || '',
        pictureUrl: restaurant.pictureUrl || '',
        latitude: restaurant.latitude || '',
        longitude: restaurant.longitude || '',
        numberOfTables: restaurant.numberOfTables || '',
        countryId: restaurant.countryId || '',
        cityId: restaurant.cityId || '',
        localLocationId: restaurant.localLocationId || '',
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
  }, [restaurant]);

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

        const updatedRestaurant = {
            name: formData.name,
            description: formData.description,
            url: formData.url,
            pictureUrl: formData.pictureUrl,
            latitude: formData.latitude,
            longitude: formData.longitude,
            numberOfTables: formData.numberOfTables,
            locationId: locationId
        }

        await ApiService.updateRestaurant(restaurant.id, updatedRestaurant);
        onRestaurantUpdated();
        onClose();

    } catch(err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to update restaurant.';
        setError(errorMessage);
        console.error('Update restaurant error:', err);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Edit Restaurant</h2>
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
            <label>URL (Optional)</label>
            <input type="url" name="url" value={formData.url} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Picture URL (Optional)</label>
            <input type="url" name="pictureUrl" value={formData.pictureUrl} onChange={handleChange} />
          </div>
           <div className="form-group">
            <label>Number of Tables</label>
            <input type="number" name="numberOfTables" value={formData.numberOfTables} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Location</label>
            <MapSelector onLocationSelect={handleLocationSelect} />
            <div className="coordinates-display">
                Latitude: {formData.latitude || 'N/A'}, Longitude: {formData.longitude || 'N/A'}
            </div>
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
          <button type="submit" className="update-restaurant-button" disabled={isSubmitting}>
            {isSubmitting ? 'Updating Restaurant...' : 'Update Restaurant'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditRestaurantModal;