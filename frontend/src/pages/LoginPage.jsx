import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/users/login',
        { email, password },
        config
      );

      // 1. Save user info to our global state
      login(data);

      // --- THIS IS THE FIX (Part 2) ---
      // 2. Redirect the user to the home page
      navigate('/');
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'An error occurred'
      );
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={submitHandler} className="login-form">
        <h1>Sign In</h1>
        {error && <div className="form-error">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="form-btn">
          Sign In
        </button>
      </form>
    </div>
  );
}

export default LoginPage;

