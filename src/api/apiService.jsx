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

  updateUser(id, userData) {
    return this.axios.put(`/user/${id}`, userData);
  }

  deleteUser(id) {
    return this.axios.delete(`/user/${id}`);
  }

  // Location Endpoints
  getCountries() {
    return this.axios.get('/countries');
  }

  getCountryById(id) {
    return this.axios.get(`/countries/${id}`);
  }

  getCitiesByCountry(countryId) {
    return this.axios.get(`/cities/country/${countryId}`);
  }

  getCityById(id) {
    return this.axios.get(`/cities/${id}`);
  }

  getLocationId(countryId, cityId, locallocationId) {
    return this.axios.post(`/location/check`, { countryId, cityId, locallocationId });
  }

  getLocationById(id) {
    return this.axios.get(`/location/${id}`);
  }
  
  getLocalLocationById(id) {
      return this.axios.get(`/locallocation/${id}`);
  }

  getLocalLocationsByCity(cityId){
      return this.axios.get(`/locallocation/city/${cityId}`);
  }

  addLocalLocation(localLocationData){
      return this.axios.post(`/locallocation`, localLocationData);
  }

  // Restaurant Management
  getRestaurants() {
    return this.axios.get('/restaurants');
  }

  getRestaurantById(id) {
    return this.axios.get(`/restaurants/${id}`);
  }

  addRestaurant(restaurantData) {
    return this.axios.post('/restaurants', restaurantData);
  }

  updateRestaurant(id, restaurantData) {
    return this.axios.put(`/restaurants/${id}`, restaurantData);
  }

  deleteRestaurant(id) {
    return this.axios.delete(`/restaurants/${id}`);
  }

  getDishesByRestaurantId(restaurantId) {
    return this.axios.get(`/restaurants/${restaurantId}/dishes`);
  }

  getRestaurantCuisines(restaurantId) {
    return this.axios.get(`/restaurants/${restaurantId}/cuisines`);
  }
  
  getAllCuisines() {
    return this.axios.get('/cuisines');
  }
  
  addCuisineToRestaurant(restaurantId, cuisineId) {
    return this.axios.post(`/restaurants/${restaurantId}/cuisines/${cuisineId}`);
  }

  removeCuisineFromRestaurant(restaurantId, cuisineId) {
    return this.axios.delete(`/restaurants/${restaurantId}/cuisines/${cuisineId}`);
  }
  
  getRestaurantFeatures(restaurantId) {
    return this.axios.get(`/restaurants/${restaurantId}/features`);
  }
  
  getAllFeatures() {
    return this.axios.get('/features');
  }
  
  addFeatureToRestaurant(restaurantId, featureId) {
    return this.axios.post(`/restaurants/${restaurantId}/features/${featureId}`);
  }

  removeFeatureFromRestaurant(restaurantId, featureId) {
    return this.axios.delete(`/restaurants/${restaurantId}/features/${featureId}`);
  }

  getRestaurantMealTypes(restaurantId) {
    return this.axios.get(`/restaurants/${restaurantId}/mealtypes`);
  }
  
  getAllMealTypes() {
    return this.axios.get('/mealtypes');
  }
  
  addMealTypeToRestaurant(restaurantId, mealTypeId) {
    return this.axios.post(`/restaurants/${restaurantId}/mealtypes/${mealTypeId}`);
  }

  removeMealTypeFromRestaurant(restaurantId, mealTypeId) {
    return this.axios.delete(`/restaurants/${restaurantId}/mealtypes/${mealTypeId}`);
  }

  getRestaurantTags(restaurantId) {
    return this.axios.get(`/restaurants/${restaurantId}/tags`);
  }

  getAllTags() {
    return this.axios.get('/tags');
  }

  addTagToRestaurant(restaurantId, tagId) {
    return this.axios.post(`/restaurants/${restaurantId}/tags/${tagId}`);
  }

  removeTagFromRestaurant(restaurantId, tagId) {
    return this.axios.delete(`/restaurants/${restaurantId}/tags/${tagId}`);
  }

  getRestaurantWorkTimes(restaurantId) {
    return this.axios.get(`/restaurants/${restaurantId}/worktimes`);
  }
  
  addWorkTime(workTimeData) {
    return this.axios.post('/WorkTimes', workTimeData);
  }
  
  addWorkTimeToRestaurant(restaurantId, workTimeId) {
    console.log('***************************************');
    console.log(restaurantId);
    console.log('***************************************');
    console.log(workTimeId);
    return this.axios.post(`/restaurants/${restaurantId}/worktimes/${workTimeId}`);
  }
  
  removeWorkTimeFromRestaurant(restaurantId, workTimeId) {
    return this.axios.delete(`/restaurants/${restaurantId}/worktimes/${workTimeId}`);
  }

  getRestaurantCurrencyTypes(restaurantId) {
    return this.axios.get(`/restaurants/${restaurantId}/currencytypes`);
  }

  // Hotel Management
  getHotels() {
    return this.axios.get('/hotels');
  }

  getHotelById(id) {
    return this.axios.get(`/hotels/${id}`);
  }

  addHotel(hotelData) {
    return this.axios.post('/hotels', hotelData);
  }

  updateHotel(id, hotelData) {
    return this.axios.put(`/hotels/${id}`, hotelData);
  }

  deleteHotel(id) {
    return this.axios.delete(`/hotels/${id}`);
  }
  
  getPropertyTypeById(id) {
      return this.axios.get(`/propertyTypes/${id}`);
  }

  getAmenitiesByHotelId(hotelId) {
    return this.axios.get(`/hotels/${hotelId}/amenities`);
  }

  getAllAmenities() {
    return this.axios.get('/amenities');
  }

  addAmenity(amenityData) {
    return this.axios.post('/amenities', amenityData);
  }

  addAmenityToHotel(hotelId, amenityId, price) {
    return this.axios.post(`/hotels/${hotelId}/amenities/${amenityId}`, { price });
  }

  deleteAmenityFromHotel(hotelId, amenityId) {
    return this.axios.delete(`/hotels/${hotelId}/amenities/${amenityId}`);
  }

  updateAmenityForHotel(hotelId, amenityId, newPrice){
    return this.axios.put(`/hotels/${hotelId}/amenities/${amenityId}`, newPrice);
  }

  getRoomsByHotelId(hotelId) {
    return this.axios.get(`/hotels/${hotelId}/rooms`);
  }

  getRoomTypeById(id) {
    return this.axios.get(`/roomtypes/${id}`);
  }

  getAmenitiesByRoomId(roomId) {
    return this.axios.get(`/rooms/${roomId}/amenities`);
  }

  addRoomToHotel(hotelId, roomData) {
    return this.axios.post(`/hotels/${hotelId}/rooms`, roomData);
  }

  getRoomTypes() {
    return this.axios.get('/roomtype');
  }

  deleteRoomFromHotel(hotelId, roomId) {
    return this.axios.delete(`/hotels/${hotelId}/rooms/${roomId}`);
  }

  updateRoomForHotel(hotelId, roomId, roomData) {
    return this.axios.put(`/rooms/${roomId}`, roomData);
  }

  addRoomType(description) {
    return this.axios.post(`/roomtype/${encodeURIComponent(description)}`);
  }
}

export default new ApiService();