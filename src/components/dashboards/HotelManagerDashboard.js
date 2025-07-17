import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const HotelManagerDashboard = () => {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        // Assuming the manager's hotels are fetched from a dedicated endpoint
        api.get('/Hotels/manager/hotels')
            .then(response => setHotels(response.data))
            .catch(error => console.error('Error fetching hotels:', error));
    }, []);

    return (
        <div>
            <h2>Hotel Manager Dashboard</h2>
            {hotels.map(hotel => (
                <div key={hotel.id}>
                    <h3>{hotel.name}</h3>
                    <p>{hotel.numberOfRooms} rooms</p>
                </div>
            ))}
        </div>
    );
};

export default HotelManagerDashboard;