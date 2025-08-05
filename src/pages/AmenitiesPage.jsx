import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../api/apiService';
import Table from '../components/common/Table';
import AddHotelAmenityModal from '../components/common/AddHotelAmenityModal';
import EditHotelAmenityModal from '../components/common/EditHotelAmenityModal';
import ConfirmDeleteAmenityModal from '../components/common/ConfirmDeleteAmenityModal';
import Navbar from '../components/common/Navbar'; // Import Navbar
import '../assets/styles/AmenitiesPage.css';

const AmenitiesPage = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [amenities, setAmenities] = useState([]);
  const [hotelName, setHotelName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAddAmenityModalOpen, setIsAddAmenityModalOpen] = useState(false);
  const [isEditAmenityModalOpen, setIsEditAmenityModalOpen] = useState(false);
  const [amenityToEdit, setAmenityToEdit] = useState(null);
  const [amenityToDelete, setAmenityToDelete] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hotelResponse, amenitiesResponse] = await Promise.all([
        ApiService.getHotelById(hotelId),
        ApiService.getAmenitiesByHotelId(hotelId)
      ]);
      setHotelName(hotelResponse.data.name);
      setAmenities(amenitiesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [hotelId]);
  
  const handleAmenityAdded = () => {
    fetchData();
  };
  
  const handleAmenityUpdated = () => {
    fetchData();
  };

  const handleEditClick = (amenity) => {
    setAmenityToEdit(amenity);
    setIsEditAmenityModalOpen(true);
  };

  const handleDeleteClick = (amenity) => {
    setAmenityToDelete(amenity);
  };

  const handleConfirmDelete = async (amenityId) => {
    try {
      await ApiService.deleteAmenityFromHotel(hotelId, amenityId);
      fetchData();
    } catch (error) {
      console.error('Error deleting amenity:', error);
    } finally {
      setAmenityToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setAmenityToDelete(null);
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'price', header: 'Price' },
  ];
  
  const renderActions = (amenity) => (
    <>
      <button className="btn-edit" onClick={() => handleEditClick(amenity)}>Edit Price</button>
      <button className="btn-delete" onClick={() => handleDeleteClick(amenity)}>Delete</button>
    </>
  );

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
        <h2>Manage Amenities for {hotelName}</h2>
        <button className="btn-add" onClick={() => setIsAddAmenityModalOpen(true)}>Add New Amenity</button>
        {isAddAmenityModalOpen && (
          <AddHotelAmenityModal
            hotelId={hotelId}
            onClose={() => setIsAddAmenityModalOpen(false)}
            onAmenityAdded={handleAmenityAdded}
          />
        )}
        {isEditAmenityModalOpen && (
          <EditHotelAmenityModal
            amenity={amenityToEdit}
            hotelId={hotelId}
            onClose={() => setIsEditAmenityModalOpen(false)}
            onAmenityUpdated={handleAmenityUpdated}
          />
        )}
        {amenityToDelete && (
          <ConfirmDeleteAmenityModal
            amenity={amenityToDelete}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
        <Table data={amenities} columns={columns} renderActions={renderActions} />
      </div>
    </>
  );
};

export default AmenitiesPage;