import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const API_URL = 'http://localhost:5281'; // Your backend URL

class ApiService {
  constructor() {
    this.axios = axios.create({
      baseURL: API_URL,
    });

    this.axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 < Date.now()) {
            // Token is expired
            this.logout();
            window.location.href = '/login';
            return Promise.reject(new Error('Token expired'));
          }
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          // Token is invalid or malformed
          console.error('Invalid token:', error);
          this.logout();
          window.location.href = '/login';
          return Promise.reject(new Error('Invalid token'));
        }
      }
      return config;
    });

    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Unauthorized access, likely due to invalid/expired token on the server side
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials) {
    const response = await this.axios.post('/user/login', credentials);
    const token = response.data;

    if (token && typeof token === 'string') {
      try {
        const decodedToken = jwtDecode(token);
        // MODIFIED: Use the correct, full key for the role claim from the token
        const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
        const userRole = decodedToken[roleClaim];

        let isAdmin = false;
        if (userRole) {
            if (Array.isArray(userRole)) {
                // If the role is an array, check if 'admin' is one of the roles
                isAdmin = userRole.map(r => r.toLowerCase()).includes('admin');
            } else if (typeof userRole === 'string') {
                // If the role is a single string, compare it
                isAdmin = userRole.toLowerCase() === 'admin';
            }
        }
        
        if (isAdmin) {
          localStorage.setItem('token', token);
          return response;
        } else {
          throw new Error('Access Denied: User is not an administrator.');
        }
      } catch (error) {
        // This will now correctly catch our custom "Access Denied" error
        throw error;
      }
    } else {
      throw new Error('Login failed: No token received.');
    }
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        // Check if token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          this.logout();
          return null;
        }
        return decodedToken;
      }
      return null;
    } catch (error) {
      console.error('Error decoding token:', error);
      // If token is malformed, remove it
      this.logout();
      return null;
    }
  }

  // User Management
  getUsers(page = 1, pageSize = 10) {
    return this.axios.get('/user', {
      params: { page, pageSize }
    });
  }

  addUser(userData) {
    return this.axios.post('/user/signup', userData);
  }

  addAdmin(adminData) {
    return this.axios.post('/Admin', adminData);
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
    return this.axios.post(`/locations/check`, { countryId, cityId, locallocationId });
  }

  getLocationById(id) {
    return this.axios.get(`/locations/${id}`);
  }
  
  getLocalLocationById(id) {
      return this.axios.get(`/locallocations/${id}`);
  }

  getLocalLocationsByCity(cityId){
      return this.axios.get(`/locallocations/city/${cityId}`);
  }

  addLocalLocation(localLocationData){
      return this.axios.post(`/locallocations`, localLocationData);
  }

  // Restaurant Management
  getRestaurants(page = 1, pageSize = 10) {
    return this.axios.get('/restaurants', {
      params: { page, pageSize }
    });
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
  
  getDishImages(restaurantId, dishId) {
    return this.axios.get(`/restaurants/${restaurantId}/dishes/${dishId}/image`);
  }

  addDishImage(restaurantId, dishId, formData) {
    return this.axios.post(`/restaurants/${restaurantId}/dishes/${dishId}/image`, formData);
  }

  getAllDishes() {
    return this.axios.get('/dishes');
  }

  addDish(dishData) {
    return this.axios.post('/dishes', dishData);
  }

  addDishToRestaurant(restaurantId, dishDetails) {
    return this.axios.post(`/restaurants/${restaurantId}/dishes`, dishDetails);
  }

  deleteDishFromRestaurant(restaurantId, dishId) {
    return this.axios.delete(`/restaurants/${restaurantId}/dishes/${dishId}`);
  }

  updateDishForRestaurant(restaurantId, dishId, dishData) {
    return this.axios.put(`/restaurants/${restaurantId}/dishes/${dishId}`, dishData);
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
  addCuisine(cuisineData){
    return this.axios.post(`/cuisines/`, cuisineData);
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

  addFeature(featureData) {
    return this.axios.post(`/features`, featureData);
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

  addMealType(mealTypeData) {
    return this.axios.post(`/mealtypes`, mealTypeData);
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

  addTag(tagData) {
    return this.axios.post(`/tags`, tagData);
  }

  removeTagFromRestaurant(restaurantId, tagId) {
    return this.axios.delete(`/restaurants/${restaurantId}/tags/${tagId}`);
  }

  getRestaurantWorkTimes(restaurantId) {
    return this.axios.get(`/restaurants/${restaurantId}/worktimes`);
  }
  
  addWorkTimeToRestaurant(restaurantId, workTimeData) {
    return this.axios.post(`/restaurants/${restaurantId}/worktimes`, workTimeData);
  }
  
  removeWorkTimeFromRestaurant(workTimeId) {
    return this.axios.delete(`/worktimes/${workTimeId}`);
  }
  
  getRestaurantImages(restaurantId) {
    return this.axios.get(`/restaurants/${restaurantId}/images`);
  }

  addRestaurantImage(restaurantId, formData) {
    return this.axios.post(`/restaurants/${restaurantId}/images`, formData);
  }

  deleteRestaurantImage(imagePath) {
    return this.axios.delete('/restaurants/images', {
      data: { imageUrl: imagePath }
    });
  }

  getRestaurantCurrencyTypes(restaurantId) {
    return this.axios.get(`/restaurants/${restaurantId}/currencytypes`);
  }

  // Hotel Management
getHotels(page = 1, pageSize = 10) {
    return this.axios.get('/hotels', { 
      params: { page, pageSize } 
    });
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
  
  getHotelImages(hotelId) {
    return this.axios.get(`/hotels/${hotelId}/images`);
  }

  addHotelImage(hotelId, formData) {
    return this.axios.post(`/hotels/${hotelId}/images`, formData);
  }

  deleteHotelImage(imagePath) {
    return this.axios.delete('/hotels/image', {
      data: { imageUrl: imagePath }
    });
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

  getRoomImages(roomId) {
    return this.axios.get(`/rooms/${roomId}/images`);
  }

  addRoomImage(roomId, formData) {
    return this.axios.post(`/rooms/${roomId}/images`, formData);
  }

  deleteRoomImage(imagePath) {
    return this.axios.delete('/rooms/images', {
      data: { imageUrl: imagePath }
    });
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
    return this.axios.get('/roomtypes');
  }

  deleteRoomFromHotel(hotelId, roomId) {
    return this.axios.delete(`/hotels/${hotelId}/rooms/${roomId}`);
  }

  updateRoomForHotel(hotelId, roomId, roomData) {
    return this.axios.put(`/rooms/${roomId}`, roomData);
  }

  addRoomType(description) {
    return this.axios.post(`/roomtypes/${encodeURIComponent(description)}`);
  }
}

export default new ApiService();