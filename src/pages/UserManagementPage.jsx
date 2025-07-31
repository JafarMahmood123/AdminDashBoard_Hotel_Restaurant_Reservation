import React, { useState, useEffect } from 'react';
import ApiService from '../api/apiService.jsx';
import Table from '../components/common/Table.jsx';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await ApiService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    console.log('Editing user:', user);
    // Add your edit logic here
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await ApiService.deleteUser(userId);
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div className="page-container">
      <h2>User Management</h2>
      <button className="btn-add">Add New User</button>
      <Table data={users} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default UserManagementPage;