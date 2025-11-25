import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './AddMenuItem.css';

function AddMenuItem({ restaurantId, onMenuItemAdded }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { userInfo } = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!name || !price) {
      setError('Name and Price are required.');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:5000/api/menu/${restaurantId}`,
        { name, description, price },
        config
      );

      setMessage('Menu item added successfully!');
      // Clear the form
      setName('');
      setDescription('');
      setPrice('');
      // Update the parent component's state
      onMenuItemAdded(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add menu item.');
    }
  };

  return (
    <div className="add-item-container">
      <h3>Add New Menu Item</h3>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <form onSubmit={submitHandler} className="add-item-form">
        <div className="form-group">
          <label htmlFor="name">Item Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Enter a description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            step="0.01"
          />
        </div>
        <button type="submit" className="submit-btn">Add Item</button>
      </form>
    </div>
  );
}

export default AddMenuItem;
