import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5281'; // Your backend URL

class ApiService {
  constructor() {
    this.axios = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // ... (login, logout, getCurrentUser methods remain the same)
  async login(credentials) {
    const response = await this.axios.post('/auth/login', credentials);
    const { token } = response.data;

    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.role === 'admin') {
        localStorage.setItem('token', token);
        return response;
      } else {
        throw new Error('Access Denied: User is not an administrator.');
      }
    } else {
      throw new Error('Login failed: No token received.');
    }
  }

  logout() {
    localStorage.removeItem('token');
  }

  getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        return jwtDecode(token);
      }
      return null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // User Management
  getUsers() {
    return this.axios.get('/user');
  }

  addUser(userData) {
    return this.axios.post('/user/signup', userData);
  }

  deleteUser(id) {
    return this.axios.delete(`/users/${id}`);
  }

  // Location Endpoints (Countries, Cities, Location ID)
  getCountries() {
    return this.axios.get('/countries');
  }

  getCitiesByCountry(countryId) {
    return this.axios.get(`/cities/country/${countryId}`);
  }

  getLocationId(countryId, cityId) {
    return this.axios.post(`/location/check`, { countryId, cityId });
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
