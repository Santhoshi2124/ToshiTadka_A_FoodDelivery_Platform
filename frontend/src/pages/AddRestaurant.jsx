import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './AddRestaurant.css';

function AddRestaurantPage() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      // We need to send the user's token for authorization
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(
        'http://localhost:5000/api/restaurants',
        { name, address, cuisine, imageUrl },
        config
      );

      setMessage('Restaurant added successfully!');
      // Optionally, redirect after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to add restaurant.'
      );
    }
  };

  return (
    <div className="add-restaurant-container">
      <form className="add-restaurant-form" onSubmit={submitHandler}>
        <h1>Add a New Restaurant</h1>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        <div className="form-group">
          <label htmlFor="name">Restaurant Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter restaurant name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cuisine">Cuisine Type</label>
          <input
            type="text"
            id="cuisine"
            placeholder="e.g., Italian, Mexican, Indian"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL (Optional)</label>
          <input
            type="text"
            id="imageUrl"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-btn">
          Add Restaurant
        </button>
      </form>
    </div>
  );
}

export default AddRestaurantPage;
