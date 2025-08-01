import React, { useState, useEffect, useCallback } from 'react';
import ApiService from '../../api/apiService';
import '../../assets/styles/AddHotelModal.css';
import MapSelector from './MapSelector';

const AddHotelModal = ({ onClose, onHotelAdded }) => {
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
  const [showNewLocalLocation, setShowNewLocalLocation] = useState(false);
  const [newLocalLocationName, setNewLocalLocationName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    const fetchCities = async () => {
      if (formData.countryId) {
        try {
          const response = await ApiService.getCitiesByCountry(formData.countryId);
          setCities(response.data);
          setLocalLocations([]);
          setFormData(prev => ({ ...prev, cityId: '', localLocationId: '' }));
        } catch (error) {
          console.error('Error fetching cities:', error);
          setError('Failed to load cities for the selected country.');
        }
      } else {
        setCities([]);
        setLocalLocations([]);
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
          setFormData(prev => ({ ...prev, localLocationId: '' }));
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

    if (!formData.localLocationId && !newLocalLocationName.trim()) {
        setError("Please select a local location or add a new one.");
        return;
    }

    setIsSubmitting(true);
    
    try {
        let finalLocalLocationId = formData.localLocationId;

        if (showNewLocalLocation && newLocalLocationName.trim() !== '') {
            const response = await ApiService.addLocalLocation({ name: newLocalLocationName, cityId: formData.cityId });
            finalLocalLocationId = response.data.id;
            console.log(finalLocalLocationId);
        }
        
        if (!finalLocalLocationId) {
            setError("A local location is required.");
            setIsSubmitting(false);
            return;
        }

        const locationResponse = await ApiService.getLocationId(formData.countryId, formData.cityId, finalLocalLocationId);
        const locationId = locationResponse.data;

        const newHotel = {
            name: formData.name,
            description: formData.description,
            latitude: formData.latitude,
            longitude: formData.longitude,
            url: formData.url,
            locationId: locationId
        }

        await ApiService.addHotel(newHotel);
        onHotelAdded();
        onClose();

    } catch(err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to add hotel.';
        setError(errorMessage);
        console.error('Add hotel error:', err);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Add New Hotel</h2>
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
            <select name="localLocationId" value={formData.localLocationId} onChange={handleChange} disabled={!formData.cityId || showNewLocalLocation}>
              <option value="">Select a local location</option>
              {localLocations.map(location => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </select>
            <button type="button" className="btn-add-local" onClick={() => setShowNewLocalLocation(!showNewLocalLocation)} disabled={!formData.cityId}>
              {showNewLocalLocation ? 'Cancel' : 'Add New'}
            </button>
          </div>
          {showNewLocalLocation && (
            <div className="form-group">
              <label>New Local Location Name</label>
              <input type="text" value={newLocalLocationName} onChange={(e) => setNewLocalLocationName(e.target.value)} />
            </div>
          )}
          <button type="submit" className="add-hotel-button" disabled={isSubmitting}>
            {isSubmitting ? 'Adding Hotel...' : 'Add Hotel'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHotelModal;
