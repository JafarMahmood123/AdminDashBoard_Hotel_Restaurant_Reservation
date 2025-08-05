import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService, { API_URL } from '../api/apiService';
import Table from '../components/common/Table';
import RoomDetailsModal from '../components/common/RoomDetailsModal';
import AddRoomModal from '../components/common/AddRoomModal';
import EditRoomModal from '../components/common/EditRoomModal';
import ConfirmDeleteRoomModal from '../components/common/ConfirmDeleteRoomModal';
import ManageRoomImagesModal from '../components/common/ManageRoomImagesModal';
import Navbar from '../components/common/Navbar';
import '../assets/styles/RoomsPage.css';

const RoomsPage = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [hotelName, setHotelName] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState(null);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [isManageImagesModalOpen, setIsManageImagesModalOpen] = useState(false);
  const [roomForImages, setRoomForImages] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hotelResponse, roomsResponse] = await Promise.all([
        ApiService.getHotelById(hotelId),
        ApiService.getRoomsByHotelId(hotelId)
      ]);
      
      const roomsData = await Promise.all(
        roomsResponse.data.map(async (room) => {
          let imageUrl = '';
          try {
            const imageResponse = await ApiService.getRoomImages(room.id);
            if (imageResponse.data && imageResponse.data.length > 0) {
              imageUrl = `${API_URL}${imageResponse.data[0]}`;
            }
          } catch (e) {
            console.error(`Failed to fetch image for room ${room.roomNumber}`, e);
          }
          return {
            ...room,
            type: room.roomTypeDescription || 'N/A',
            imageUrl: imageUrl,
          };
        })
      );

      roomsData.sort((a, b) => a.roomNumber - b.roomNumber);

      setHotelName(hotelResponse.data.name);
      setRooms(roomsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [hotelId]);

  const handleShowInfo = (room) => {
    setSelectedRoom(room);
  };
  
  const handleRoomAdded = () => {
    fetchData();
  };

  const handleRoomUpdated = () => {
    fetchData();
  };

  const handleImagesUpdated = () => {
    fetchData();
  };

  const handleEditClick = (room) => {
    setRoomToEdit(room);
    setIsEditRoomModalOpen(true);
  };

  const handleDeleteClick = (room) => {
    setRoomToDelete(room);
  };

  const handleConfirmDelete = async (roomId) => {
    try {
      await ApiService.deleteRoomFromHotel(hotelId, roomId);
      fetchData();
    } catch (error) {
      console.error('Error deleting room:', error);
    } finally {
      setRoomToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setRoomToDelete(null);
  };

  const handleManageImages = (room) => {
    setRoomForImages(room);
    setIsManageImagesModalOpen(true);
  };

  const columns = [
    { key: 'roomNumber', header: 'Room Number' },
    {
      key: 'imageUrl',
      header: 'Image',
      render: (room) => (
        room.imageUrl ? (
          <img 
            src={room.imageUrl} 
            alt={`Room ${room.roomNumber}`}
            className="room-image"
          />
        ) : 'No Image'
      ),
    },
    { key: 'maxOccupancy', header: 'Max Occupancy' },
    { key: 'description', header: 'Description' },
    { key: 'price', header: 'Price' },
    { key: 'type', header: 'Type' },
  ];
  
  const renderActions = (room) => (
    <>
      <button className="btn-edit" onClick={() => handleEditClick(room)}>Edit</button>
      <button className="btn-delete" onClick={() => handleDeleteClick(room)}>Delete</button>
      <button className="btn-manage" onClick={() => handleShowInfo(room)}>Show Full Information</button>
      <button className="btn-manage" onClick={() => handleManageImages(room)}>Manage Images</button>
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
        <h2>Manage Rooms for {hotelName}</h2>
        <button className="btn-add" onClick={() => setIsAddRoomModalOpen(true)}>Add New Room</button>
        {isAddRoomModalOpen && (
          <AddRoomModal
            hotelId={hotelId}
            onClose={() => setIsAddRoomModalOpen(false)}
            onRoomAdded={handleRoomAdded}
          />
        )}
        {isEditRoomModalOpen && (
          <EditRoomModal
            room={roomToEdit}
            hotelId={hotelId}
            onClose={() => setIsEditRoomModalOpen(false)}
            onRoomUpdated={handleRoomUpdated}
          />
        )}
        {selectedRoom && (
          <RoomDetailsModal
            room={selectedRoom}
            onClose={() => setSelectedRoom(null)}
          />
        )}
        {roomToDelete && (
          <ConfirmDeleteRoomModal
            room={roomToDelete}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
        {isManageImagesModalOpen && (
          <ManageRoomImagesModal
            room={roomForImages}
            onClose={() => setIsManageImagesModalOpen(false)}
            onImagesUpdated={handleImagesUpdated}
          />
        )}
        <Table data={rooms} columns={columns} renderActions={renderActions} />
      </div>
    </>
  );
};

export default RoomsPage;