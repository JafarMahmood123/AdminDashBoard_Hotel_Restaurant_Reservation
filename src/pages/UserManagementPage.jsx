import React, { useState, useEffect } from 'react';
import ApiService from '../api/apiService.jsx';
import Table from 'C:/Users/Jafar Mahmood/admin-dashboard/src/components/common/Table.jsx';
import 'C:/Users/Jafar Mahmood/admin-dashboard/src/assets/styles/UserManagementPage.css';
import AddUserModal from 'C:/Users/Jafar Mahmood/admin-dashboard/src/components/common/AddUserModal.jsx';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

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
    { key: 'fullName', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div className="page-container">
      <h2>User Management</h2>
      <button className="btn-add" onClick={() => setIsModalOpen(true)}>Add New User</button>
      
      {isModalOpen && (
        <AddUserModal 
          onClose={() => setIsModalOpen(false)} 
          onUserAdded={fetchUsers} 
        />
      )}

      <Table data={users} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default UserManagementPage;