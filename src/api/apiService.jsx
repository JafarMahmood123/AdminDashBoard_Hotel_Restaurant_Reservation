import axios from 'axios';
import jwt_decode from 'jwt-decode';

const API_URL = 'http://localhost:8080/api'; // Your backend URL

class ApiService {
  constructor() {
    this.axios = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Automatically add the auth token to each request
    this.axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Authentication
  login(credentials) {
    return this.axios.post('/auth/login', credentials);
  }

  // User Management
  getUsers() {
    return this.axios.get('/users');
  }

  deleteUser(id) {
    return this.axios.delete(`/users/${id}`);
  }

  // Restaurant Management
  getRestaurants() {
    return this.axios.get('/restaurants');
  }

  deleteRestaurant(id) {
    return this.axios.delete(`/restaurants/${id}`);
  }

  // Hotel Management
  getHotels() {
    return this.axios.get('/hotels');
  }

  deleteHotel(id) {
    return this.axios.delete(`/hotels/${id}`);
  }
}

export default new ApiService();
