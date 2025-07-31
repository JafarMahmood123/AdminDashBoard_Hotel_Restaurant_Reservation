import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../api/apiService';
import 'C:/Users/Jafar Mahmood/admin-dashboard/src/assets/styles/LogInPage.css';

const LogInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await ApiService.login({ email, password });
      // Assuming the token is in response.data.token
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
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
