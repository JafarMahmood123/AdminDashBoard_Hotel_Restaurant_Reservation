import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../api/apiService';
import Table from '../components/common/Table';
import RoomDetailsModal from '../components/common/RoomDetailsModal';
import AddRoomModal from '../components/common/AddRoomModal';
import EditRoomModal from '../components/common/EditRoomModal';
import ConfirmDeleteRoomModal from '../components/common/ConfirmDeleteRoomModal';
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hotelResponse, roomsResponse] = await Promise.all([
        ApiService.getHotelById(hotelId),
        ApiService.getRoomsByHotelId(hotelId)
      ]);
      
      const roomsData = roomsResponse.data.map((room) => ({
        ...room,
        type: room.roomTypeDescription || 'N/A',
      }));

      // Sort rooms by room number
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

  const columns = [
    { key: 'roomNumber', header: 'Room Number' },
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
    </>
  );

  if (loading) {
    return <div className="page-container"><h2>Loading...</h2></div>;
  }

  return (
    <div className="page-container">
      <button className="btn-back" onClick={() => navigate('/hotels')}>&larr; Back to Hotels</button>
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
      <Table data={rooms} columns={columns} renderActions={renderActions} />
    </div>
  );
};

export default RoomsPage;