import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const EventManagerDashboard = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        api.get('/Events/manager/events')
            .then(response => setEvents(response.data))
            .catch(error => console.error('Error fetching events:', error));
    }, []);

    return (
        <div>
            <h2>Event Manager Dashboard</h2>
            {events.map(event => (
                <div key={event.id}>
                    <h3>{event.name}</h3>
                    <p>{event.description}</p>
                </div>
            ))}
        </div>
    );
};

export default EventManagerDashboard;