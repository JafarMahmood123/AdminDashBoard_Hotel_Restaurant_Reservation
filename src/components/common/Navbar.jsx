import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import ApiService from '../../api/apiService';
import '../../assets/styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const handleLogout = () => {
    ApiService.logout();
    navigate('/login');
  };

  const getBackLink = () => {
    const { pathname } = location;

    if (pathname === '/') {
      return null; // No back button on the home page
    }
    if (pathname.startsWith('/hotels/') && params.hotelId) {
        return { text: '← Back to Hotels', path: '/hotels' };
    }
    if (pathname.startsWith('/restaurants/') && params.restaurantId) {
        return { text: '← Back to Restaurants', path: '/restaurants' };
    }
    if (['/users', '/hotels', '/restaurants'].includes(pathname)) {
        return { text: '← Back to Home', path: '/' };
    }
    
    return null;
  };

  const backLink = getBackLink();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {backLink && (
          <button onClick={() => navigate(backLink.path)} className="nav-button back-button">
            {backLink.text}
          </button>
        )}
      </div>
      <div className="navbar-right">
        <button onClick={handleLogout} className="nav-button logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;