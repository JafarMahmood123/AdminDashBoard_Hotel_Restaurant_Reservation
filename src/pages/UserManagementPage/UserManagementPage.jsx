import React, { useMemo } from 'react';
import Table from '../../components/Table/Table'; // Import the new Table component
import './UserManagementPage.css'; // We will update this file next

// Sample data - replace with your actual data fetching logic
const users = [
  { id: 1, name: 'Jafar Mahmood', email: 'jafar@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Ali Ahmad', email: 'ali.ahmad@example.com', role: 'Editor', status: 'Pending' },
  { id: 3, name: 'Sara Khan', email: 'sara.khan@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'David Wilson', email: 'david.w@example.com', role: 'Editor', status: 'Active' },
];

const UserManagementPage = () => {
  // Define the columns for the table
  // useMemo is used for performance optimization, preventing re-creation on every render
  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessor: 'name',
      },
      {
        header: 'Email',
        accessor: 'email',
      },
      {
        header: 'Role',
        accessor: 'role',
      },
      {
        header: 'Status',
        accessor: 'status',
      },
      {
        header: 'Actions',
        accessor: 'actions',
        // Use a custom Cell renderer for the action buttons
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button className="edit-btn" onClick={() => alert(`Editing user ${row.id}`)}>Edit</button>
            <button className="delete-btn" onClick={() => alert(`Deleting user ${row.id}`)}>Delete</button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="user-management-page">
      <header className="user-management-header">
        <h1>User Management</h1>
      </header>

      <div className="toolbar">
        <div className="search-bar">
          <input type="text" placeholder="Search users..." />
        </div>
        <button className="add-user-btn">Add New User</button>
      </div>

      <Table columns={columns} data={users} />
    </div>
  );
};

export default UserManagementPage;
