import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  

const App = () => {
    const { user, login, logout } = useAuth();

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage login={login} />} />

                {/* Role-Based Routes */}
                <Route path="/admin" element={<PrivateRoute user={user} role="Admin"><AdminPage /></PrivateRoute>} />
                <Route path="/hotel-manager" element={<PrivateRoute user={user} role="HotelManager"><HotelManagerPage /></PrivateRoute>} />
                <Route path="/restaurant-manager" element={<PrivateRoute user={user} role="RestaurantManager"><RestaurantManagerPage /></PrivateRoute>} />
                <Route path="/event-manager" element={<PrivateRoute user={user} role="EventManager"><EventManagerPage /></PrivateRoute>} />
            </Routes>
        </Router>
    );
};

export default App;