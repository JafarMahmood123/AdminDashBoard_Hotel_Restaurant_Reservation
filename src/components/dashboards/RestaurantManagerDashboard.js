import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const RestaurantManagerDashboard = () => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        api.get('/Restaurants/manager/restaurants')
            .then(response => setRestaurants(response.data))
            .catch(error => console.error('Error fetching restaurants:', error));
    }, []);

    return (
        <div>
            <h2>Restaurant Manager Dashboard</h2>
            {restaurants.map(restaurant => (
                <div key={restaurant.id}>
                    <h3>{restaurant.name}</h3>
                    <p>{restaurant.description}</p>
                </div>
            ))}
        </div>
    );
};

export default RestaurantManagerDashboard;