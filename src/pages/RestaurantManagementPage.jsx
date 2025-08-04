import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService, { API_URL } from '../api/apiService.jsx';
import Table from '../components/common/Table.jsx';
import AddRestaurantModal from '../components/common/AddRestaurantModal.jsx';
import EditRestaurantModal from '../components/common/EditRestaurantModal.jsx';
import ConfirmDeleteRestaurantModal from '../components/common/ConfirmDeleteRestaurantModal.jsx';

const RestaurantManagementPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] = useState(false);
  const [isEditRestaurantModalOpen, setIsEditRestaurantModalOpen] = useState(false);
  const [restaurantToEdit, setRestaurantToEdit] = useState(null);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchRestaurantsAndDetails = async () => {
    try {
      const response = await ApiService.getRestaurants();
      const restaurantsData = response.data;

      const detailedRestaurants = await Promise.all(
        restaurantsData.map(async (restaurant) => {
          let location = 'N/A';
          if (restaurant.locationId) {
            try {
              const locationResponse = await ApiService.getLocationById(restaurant.locationId);
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
              console.error(`Failed to fetch location for restaurant ${restaurant.id}`, e);
            }
          }
          
          let imageUrl = '';
          try {
            const imageResponse = await ApiService.getRestaurantImages(restaurant.id);
            if (imageResponse.data && imageResponse.data.length > 0) {
              imageUrl = `${API_URL}${imageResponse.data[0]}`;
            }
          } catch (e) {
            console.error(`Failed to fetch image for restaurant ${restaurant.id}`, e);
          }

          const description = restaurant.description && restaurant.description.length > 50
            ? `${restaurant.description.substring(0, 50)}...`
            : restaurant.description;

          return {
            ...restaurant,
            description,
            location,
            priceRange: `$${restaurant.minPrice} - $${restaurant.maxPrice}`,
            imageUrl,
          };
        })
      );

      const sortedRestaurants = detailedRestaurants.sort((a, b) => a.name.localeCompare(b.name));
      setRestaurants(sortedRestaurants);

    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };


  useEffect(() => {
    fetchRestaurantsAndDetails();
  }, []);
  
  const handleRestaurantAdded = () => {
    fetchRestaurantsAndDetails();
    setIsAddRestaurantModalOpen(false);
  };

  const handleRestaurantUpdated = () => {
    fetchRestaurantsAndDetails();
    setIsEditRestaurantModalOpen(false);
  };

  const handleEdit = (restaurant) => {
    setRestaurantToEdit(restaurant);
    setIsEditRestaurantModalOpen(true);
  };

  const handleDelete = (restaurant) => {
    setRestaurantToDelete(restaurant);
  };

  const handleConfirmDelete = async (restaurantId) => {
    try {
      await ApiService.deleteRestaurant(restaurantId);
      fetchRestaurantsAndDetails();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    } finally {
      setRestaurantToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setRestaurantToDelete(null);
  };

  const handleManage = (restaurant) => {
    navigate(`/restaurants/${restaurant.id}/manage`);
  };

  const columns = [
    { key: 'name', header: 'Name' },
    {
      key: 'imageUrl',
      header: 'Image',
      render: (restaurant) => (
        restaurant.imageUrl ? (
          <img 
            src={restaurant.imageUrl} 
            alt={restaurant.name} 
            className="restaurant-image"
          />
        ) : 'No Image'
      ),
    },
    { key: 'description', header: 'Description' },
    { key: 'starRating', header: 'Star Rating' },
    { key: 'numberOfTables', header: 'Tables' },
    { key: 'priceLevel', header: 'Price Level' },
    { key: 'priceRange', header: 'Price Range' },
    { key: 'location', header: 'Location' },
  ];

  return (
    <div className="page-container">
      <button className="btn-back" onClick={() => navigate('/')}>&larr; Back to Home</button>
      <h2>Restaurant Management</h2>
      <button className="btn-add" onClick={() => setIsAddRestaurantModalOpen(true)}>Add New Restaurant</button>
      {isAddRestaurantModalOpen && (
        <AddRestaurantModal
          onClose={() => setIsAddRestaurantModalOpen(false)}
          onRestaurantAdded={handleRestaurantAdded}
        />
      )}
      {isEditRestaurantModalOpen && (
        <EditRestaurantModal
          restaurant={restaurantToEdit}
          onClose={() => setIsEditRestaurantModalOpen(false)}
          onRestaurantUpdated={handleRestaurantUpdated}
        />
      )}
      {restaurantToDelete && (
        <ConfirmDeleteRestaurantModal
          restaurant={restaurantToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      <Table 
        data={restaurants} 
        columns={columns} 
        renderActions={(restaurant) => (
          <>
            <button className="btn-edit" onClick={() => handleEdit(restaurant)}>Edit</button>
            <button className="btn-delete" onClick={() => handleDelete(restaurant)}>Delete</button>
            <button className="btn-manage" onClick={() => handleManage(restaurant)}>Manage</button>
          </>
        )}
      />
    </div>
  );
};

export default RestaurantManagementPage;