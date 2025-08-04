import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../api/apiService';
import Table from '../components/common/Table';
import AddUserModal from '../components/common/AddUserModal';
import EditUserModal from '../components/common/EditUserModal';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';
import AddAdminModal from '../components/common/AddAdminModal';
import '../assets/styles/UserManagementPage.css';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getUsers();
      
      const detailedUsers = await Promise.all(
        response.data.map(async (user) => {
          let location = 'N/A';
          if (user.locationId) {
            try {
              const locationResponse = await ApiService.getLocationById(user.locationId);
              const loc = locationResponse.data;

              const promises = [];
              if (loc.countryId) promises.push(ApiService.getCountryById(loc.countryId));
              if (loc.cityId) promises.push(ApiService.getCityById(loc.cityId));
              if (loc.localLocationId) promises.push(ApiService.getLocalLocationById(loc.localLocationId));
              
              const results = await Promise.all(promises);
              
              const locationParts = results.map(res => res.data.name);
              
              if(locationParts.length > 0) {
                location = locationParts.reverse().join(', ');
              }

            } catch (e) {
              console.error(`Failed to fetch location for user ${user.id}`, e);
            }
          }
          return {
            ...user,
            birthDate: user.birthDate ? new Date(user.birthDate).toLocaleDateString() : 'N/A',
            location: location,
          };
        })
      );

      // Sort users by first name
      const sortedUsers = detailedUsers.sort((a, b) => 
        (a.firstName || '').localeCompare(b.firstName || '')
      );
      setUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserAdded = () => {
    fetchUsers();
  };

  const handleUserUpdated = () => {
    fetchUsers();
  };

  const handleAdminAdded = () => {
    fetchUsers();
  };

  const handleEdit = (user) => {
    setUserToEdit(user);
    setIsEditUserModalOpen(true);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
  };

  const handleConfirmDelete = async (userId) => {
    try {
      await ApiService.deleteUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setUserToDelete(null);
  };

  const columns = [
    { key: 'firstName', header: 'First Name' },
    { key: 'lastName', header: 'Last Name' },
    { key: 'email', header: 'Email' },
    { key: 'birthDate', header: 'Birth Date' },
    { key: 'age', header: 'Age' },
    { key: 'location', header: 'Location' },
    { key: 'roleName', header: 'Role' },
  ];

  if (loading) {
    return <div className="page-container"><h2>Loading...</h2></div>;
  }

  return (
    <div className="page-container">
      <button className="btn-back" onClick={() => navigate('/')}>&larr; Back to Home</button>
      <h2>User Management</h2>
      <div className="action-buttons">
        <button className="btn-add" onClick={() => setIsAddUserModalOpen(true)}>Add New User</button>
        <button className="btn-add-admin" onClick={() => setIsAddAdminModalOpen(true)}>Add New Admin</button>
      </div>
      {isAddUserModalOpen && (
        <AddUserModal
          onClose={() => setIsAddUserModalOpen(false)}
          onUserAdded={handleUserAdded}
        />
      )}
      {isAddAdminModalOpen && (
        <AddAdminModal
          onClose={() => setIsAddAdminModalOpen(false)}
          onAdminAdded={handleAdminAdded}
        />
      )}
      {isEditUserModalOpen && (
        <EditUserModal
          user={userToEdit}
          onClose={() => setIsEditUserModalOpen(false)}
          onUserUpdated={handleUserUpdated}
        />
      )}
      {userToDelete && (
        <ConfirmDeleteModal
          user={userToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      <Table 
        data={users} 
        columns={columns} 
        renderActions={(user) => (
          <>
            <button className="btn-edit" onClick={() => handleEdit(user)}>Edit</button>
            <button className="btn-delete" onClick={() => handleDelete(user)}>Delete</button>
          </>
        )}
      />
    </div>
  );
};

export default UserManagementPage;
