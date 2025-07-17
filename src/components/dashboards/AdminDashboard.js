import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        api.get('/Admin/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.firstName} {user.lastName} - {user.email}</li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;