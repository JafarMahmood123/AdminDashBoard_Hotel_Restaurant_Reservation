import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../api/apiService.jsx';
import Table from '../components/common/Table.jsx';
import AddHotelModal from '../components/common/AddHotelModal.jsx';
import EditHotelModal from '../components/common/EditHotelModal.jsx';
import ConfirmDeleteHotelModal from '../components/common/ConfirmDeleteHotelModal.jsx';

const HotelManagementPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddHotelModalOpen, setIsAddHotelModalOpen] = useState(false);
  const [isEditHotelModalOpen, setIsEditHotelModalOpen] = useState(false);
  const [hotelToEdit, setHotelToEdit] = useState(null);
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchHotelsAndDetails = async () => {
    setLoading(true);
    try {
      const hotelsResponse = await ApiService.getHotels();
      const hotelsData = hotelsResponse.data;

      const detailedHotels = await Promise.all(
        hotelsData.map(async (hotel) => {
          let propertyType = 'N/A';
          if (hotel.propertyTypeId) {
            try {
              const propTypeResponse = await ApiService.getPropertyTypeById(hotel.propertyTypeId);
              propertyType = propTypeResponse.data.name;
            } catch (e) {
              console.error(`Failed to fetch property type for hotel ${hotel.id}`, e);
            }
          }

          let location = 'N/A';
          if (hotel.locationId) {
            try {
              const locationResponse = await ApiService.getLocationById(hotel.locationId);
              const loc = locationResponse.data;

              const [countryResponse, cityResponse, localLocationResponse] = await Promise.all([
                ApiService.getCountryById(loc.countryId),
                ApiService.getCityById(loc.cityId),
                ApiService.getLocalLocationById(loc.localLocationId)
              ]);
              
              const country = countryResponse.data.name;
              const city = cityResponse.data.name;
              const localLocation = localLocationResponse.data.name;

              location = `${localLocation}, ${city}, ${country}`;

            } catch (e) {
              console.error(`Failed to fetch location for hotel ${hotel.id}`, e);
            }
          }

          return {
            ...hotel,
            description: hotel.description || 'No description available.',
            priceRange: `$${hotel.minPrice} - $${hotel.maxPrice}`,
            propertyType,
            location,
          };
        })
      );

      // Sort hotels alphabetically by name before setting the state
      const sortedHotels = detailedHotels.sort((a, b) => a.name.localeCompare(b.name));
      setHotels(sortedHotels);

    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelsAndDetails();
  }, []);

  const handleEdit = (hotel) => {
    setHotelToEdit(hotel);
    setIsEditHotelModalOpen(true);
  };

  const handleDelete = (hotel) => {
    setHotelToDelete(hotel);
  };

  const handleConfirmDelete = async (hotelId) => {
    try {
      await ApiService.deleteHotel(hotelId);
      fetchHotelsAndDetails(); // Refresh the list with details
    } catch (error) {
      console.error('Error deleting hotel:', error);
    } finally {
      setHotelToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setHotelToDelete(null);
  };
  
  const handleHotelAdded = () => {
      fetchHotelsAndDetails();
  }
  
  const handleHotelUpdated = () => {
      fetchHotelsAndDetails();
  }
  
  const handleManageAmenities = (hotel) => {
    navigate(`/hotels/${hotel.id}/amenities`);
  };

  const handleManageRooms = (hotel) => {
    // Placeholder for future implementation
    console.log('Managing rooms for:', hotel.name);
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
    { key: 'starRate', header: 'Star Rate' },
    { key: 'numberOfRooms', header: 'Rooms' },
    { key: 'priceRange', header: 'Price Range' },
    { key: 'propertyType', header: 'Property Type' },
    { key: 'location', header: 'Location' },
  ];

  if (loading) {
    return <div className="page-container"><h2>Loading...</h2></div>;
  }

  return (
    <div className="page-container">
      <h2>Hotel Management</h2>
      <button className="btn-add" onClick={() => setIsAddHotelModalOpen(true)}>Add New Hotel</button>
      {isAddHotelModalOpen && (
        <AddHotelModal
          onClose={() => setIsAddHotelModalOpen(false)}
          onHotelAdded={handleHotelAdded}
        />
      )}
      {isEditHotelModalOpen && (
        <EditHotelModal
          hotel={hotelToEdit}
          onClose={() => setIsEditHotelModalOpen(false)}
          onHotelUpdated={handleHotelUpdated}
        />
      )}
      {hotelToDelete && (
        <ConfirmDeleteHotelModal
          hotel={hotelToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      <Table 
        data={hotels} 
        columns={columns} 
        renderActions={(hotel) => (
          <>
            <button className="btn-edit" onClick={() => handleEdit(hotel)}>Edit</button>
            <button className="btn-delete" onClick={() => handleDelete(hotel)}>Delete</button>
            <button className="btn-manage" onClick={() => handleManageAmenities(hotel)}>Manage Amenities</button>
            <button className="btn-manage" onClick={() => handleManageRooms(hotel)}>Manage Rooms</button>
          </>
        )}
      />
    </div>
  );
};

export default HotelManagementPage;