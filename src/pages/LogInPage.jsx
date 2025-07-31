import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../api/apiService';
import '../assets/styles/LogInPage.css'; // Corrected CSS import

const LogInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // ApiService.login now handles token storage and admin role validation.
      // It will throw an error if the login is invalid or the user is not an admin.
      await ApiService.login({ email, password });

      // If login is successful, navigate to the admin home page.
      navigate('/');
    } catch (err) {
      // Display a more specific error message from the API service or a generic one.
      const errorMessage = err.response?.data?.message || err.message || 'Failed to login. Please check your credentials.';
      setError(errorMessage);
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default LogInPage;
