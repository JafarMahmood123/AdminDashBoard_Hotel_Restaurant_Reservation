import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService, { API_URL } from '../api/apiService.jsx';
import Table from '../components/common/Table.jsx';
import AddHotelModal from '../components/common/AddHotelModal.jsx';
import EditHotelModal from '../components/common/EditHotelModal.jsx';
import ConfirmDeleteHotelModal from '../components/common/ConfirmDeleteHotelModal.jsx';
import ManageHotelImagesModal from '../components/common/ManageHotelImagesModal.jsx';
import Navbar from '../components/common/Navbar.jsx';

const HotelManagementPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddHotelModalOpen, setIsAddHotelModalOpen] = useState(false);
  const [isEditHotelModalOpen, setIsEditHotelModalOpen] = useState(false);
  const [hotelToEdit, setHotelToEdit] = useState(null);
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [isManageImagesModalOpen, setIsManageImagesModalOpen] = useState(false);
  const [hotelForImages, setHotelForImages] = useState(null);
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const fetchHotelsAndDetails = async (page) => {
    setLoading(true);
    try {
      const hotelsResponse = await ApiService.getHotels(page, pagination.pageSize);
      const { items, ...paginationData } = hotelsResponse.data;

      setPagination({
        currentPage: paginationData.page,
        totalPages: paginationData.totalPages,
        pageSize: paginationData.pageSize,
        totalCount: paginationData.totalCount,
        hasNextPage: paginationData.hasNextPage,
        hasPreviousPage: paginationData.hasPreviousPage,
      });

      const detailedHotels = await Promise.all(
        items.map(async (hotel) => {
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

          let imageUrl = '';
          try {
            const imageResponse = await ApiService.getHotelImages(hotel.id);
            if (imageResponse.data && imageResponse.data.length > 0) {
              imageUrl = `${API_URL}${imageResponse.data[0]}`;
            }
          } catch (e) {
            console.error(`Failed to fetch image for hotel ${hotel.id}`, e);
          }

          return {
            ...hotel,
            description: hotel.description || 'No description available.',
            priceRange: `$${hotel.minPrice} - $${hotel.maxPrice}`,
            propertyType,
            location,
            imageUrl,
          };
        })
      );

      const sortedHotels = detailedHotels.sort((a, b) => a.name.localeCompare(b.name));
      setHotels(sortedHotels);

    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelsAndDetails(pagination.currentPage);
  }, [pagination.currentPage]);

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
      fetchHotelsAndDetails(pagination.currentPage);
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
      fetchHotelsAndDetails(pagination.currentPage);
  }
  
  const handleHotelUpdated = () => {
      fetchHotelsAndDetails(pagination.currentPage);
  }

  const handleImagesUpdated = () => {
    fetchHotelsAndDetails(pagination.currentPage);
  };
  
  const handleManageAmenities = (hotel) => {
    navigate(`/hotels/${hotel.id}/amenities`);
  };

  const handleManageRooms = (hotel) => {
    navigate(`/hotels/${hotel.id}/rooms`);
  };

  const handleManageImages = (hotel) => {
    setHotelForImages(hotel);
    setIsManageImagesModalOpen(true);
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    {
      key: 'imageUrl',
      header: 'Image',
      render: (hotel) => (
        hotel.imageUrl ? (
          <img 
            src={hotel.imageUrl} 
            alt={hotel.name} 
            className="hotel-image"
          />
        ) : 'No Image'
      ),
    },
    { key: 'description', header: 'Description' },
    { key: 'starRate', header: 'Star Rate' },
    { key: 'numberOfRooms', header: 'Rooms' },
    { key: 'priceRange', header: 'Price Range' },
    { key: 'propertyType', header: 'Property Type' },
    { key: 'location', header: 'Location' },
  ];

  if (loading) {
    return (
        <>
            <Navbar />
            <div className="page-container"><h2>Loading...</h2></div>
        </>
    );
  }

  return (
    <>
      <Navbar />
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
        {isManageImagesModalOpen && (
          <ManageHotelImagesModal
            hotel={hotelForImages}
            onClose={() => setIsManageImagesModalOpen(false)}
            onImagesUpdated={handleImagesUpdated}
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
              <button className="btn-manage" onClick={() => handleManageImages(hotel)}>Manage Images</button>
            </>
          )}
        />
        <div className="pagination-controls" style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button onClick={handlePreviousPage} disabled={!pagination.hasPreviousPage}>
            Previous
          </button>
          <span style={{ margin: '0 1rem' }}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button onClick={handleNextPage} disabled={!pagination.hasNextPage}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default HotelManagementPage;