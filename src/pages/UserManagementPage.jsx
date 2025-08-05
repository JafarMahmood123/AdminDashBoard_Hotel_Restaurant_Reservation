import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../api/apiService';
import Table from '../components/common/Table';
import AddUserModal from '../components/common/AddUserModal';
import EditUserModal from '../components/common/EditUserModal';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';
import AddAdminModal from '../components/common/AddAdminModal';
import Navbar from '../components/common/Navbar';
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

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const response = await ApiService.getUsers(page, pagination.pageSize);
      const { items, ...paginationData } = response.data;

      setPagination({
        currentPage: paginationData.page,
        totalPages: paginationData.totalPages,
        pageSize: paginationData.pageSize,
        totalCount: paginationData.totalCount,
        hasNextPage: paginationData.hasNextPage,
        hasPreviousPage: paginationData.hasPreviousPage,
      });

      const detailedUsers = await Promise.all(
        items.map(async (user) => {
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
    fetchUsers(pagination.currentPage);
  }, [pagination.currentPage]);

  const handleUserAdded = () => {
    fetchUsers(pagination.currentPage);
  };

  const handleUserUpdated = () => {
    fetchUsers(pagination.currentPage);
  };

  const handleAdminAdded = () => {
    fetchUsers(pagination.currentPage);
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
      fetchUsers(pagination.currentPage);
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setUserToDelete(null);
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
    { key: 'firstName', header: 'First Name' },
    { key: 'lastName', header: 'Last Name' },
    { key: 'email', header: 'Email' },
    { key: 'birthDate', header: 'Birth Date' },
    { key: 'age', header: 'Age' },
    { key: 'location', header: 'Location' },
    { key: 'roleName', header: 'Role' },
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

export default UserManagementPage;