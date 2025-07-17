// src/pages/UserProfile.js
import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { jwtDecode } from 'jwt-decode'; // Corrected import
import { TextField, Button, Container, Typography, Card, CardContent, CircularProgress } from '@mui/material';

const UserProfile = () => {
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Decode the token to get the current user's ID and suggest it in the form
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // The 'sub' claim typically holds the user ID
        const currentUserId = decodedToken.sub;
        setUserId(currentUserId);
      } catch (e) {
        console.error("Invalid token", e);
      }
    }
  }, []);

  const handleFetchUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUserData(null);
    try {
      const response = await apiClient.get(`/User/${userId}`);
      setUserData(response.data.value); // The actual user data is in response.data.value
    } catch (err) {
      setError('Failed to fetch user data. Please check the ID and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        User Information
      </Typography>
      <form onSubmit={handleFetchUser}>
        <TextField
          label="User ID"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Fetch User'}
        </Button>
      </form>

      {error && (
        <Typography color="error" style={{ marginTop: '20px' }}>
          {error}
        </Typography>
      )}

      {userData && (
        <Card style={{ marginTop: '20px' }}>
          <CardContent>
            <Typography variant="h5">User Details</Typography>
            <Typography><strong>ID:</strong> {userData.id}</Typography>
            <Typography><strong>First Name:</strong> {userData.firstName}</Typography>
            <Typography><strong>Last Name:</strong> {userData.lastName}</Typography>
            <Typography><strong>Email:</strong> {userData.email}</Typography>
            <Typography><strong>Role:</strong> {userData.roleName || 'N/A'}</Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default UserProfile;