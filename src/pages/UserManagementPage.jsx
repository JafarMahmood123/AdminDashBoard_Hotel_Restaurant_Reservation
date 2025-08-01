import React, { useState, useEffect } from 'react';
import ApiService from '../api/apiService.jsx';
import Table from '../components/common/Table.jsx';
import '../assets/styles/UserManagementPage.css';
import AddUserModal from '../components/common/AddUserModal.jsx';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal.jsx';
import EditUserModal from '../components/common/EditUserModal.jsx';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await ApiService.getUsers();
      const usersWithFullName = response.data.map(user => ({
        ...user,
        fullName: `${user.firstName} ${user.lastName}`.trim()
      }));
      usersWithFullName.sort((a, b) => a.fullName.localeCompare(b.fullName));
      setUsers(usersWithFullName);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await ApiService.deleteUser(userToDelete);
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setIsConfirmModalOpen(false);
        setUserToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setUserToDelete(null);
  };

  const handleUserUpdated = () => {
    fetchUsers();
  };

  const columns = [
    { key: 'fullName', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div className="page-container">
      <h2>User Management</h2>
      <button className="btn-add" onClick={() => setIsAddUserModalOpen(true)}>Add New User</button>
      
      {isAddUserModalOpen && (
        <AddUserModal 
          onClose={() => setIsAddUserModalOpen(false)} 
          onUserAdded={fetchUsers} 
        />
      )}

      {isEditModalOpen && (
        <EditUserModal
          user={userToEdit}
          onClose={() => setIsEditModalOpen(false)}
          onUserUpdated={handleUserUpdated}
        />
      )}

      {isConfirmModalOpen && (
        <ConfirmDeleteModal 
          message="Are you sure you want to delete this user?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      <Table data={users} columns={columns} onEdit={handleEditClick} onDelete={handleDeleteClick} />
    </div>
  );
};

export default UserManagementPage;
