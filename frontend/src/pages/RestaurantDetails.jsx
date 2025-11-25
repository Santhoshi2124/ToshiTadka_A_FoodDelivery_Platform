import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import AddMenuItem from '../components/AddMenuItems';
import './RestaurantDetails.css';

function RestaurantDetailsPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { userInfo } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      const { data: restaurantData } = await axios.get(`http://localhost:5000/api/restaurants/${id}`);
      setRestaurant(restaurantData);

      const { data: menuData } = await axios.get(`http://localhost:5000/api/menu/${id}`);
      setMenuItems(menuData);

      setLoading(false);
    } catch (err) {
      setError('Could not fetch restaurant details.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const handleMenuItemAdded = () => {
    // Re-fetch the menu items so the new one appears instantly
    fetchRestaurantDetails();
  };

  // --- THIS IS THE FIX ---
  // We now check if restaurant.owner exists before trying to access its _id.
  const isOwner = userInfo && restaurant && restaurant.owner && userInfo._id === restaurant.owner._id;

  return (
    <div className="details-container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="details-error">{error}</div>
      ) : restaurant ? (
        <>
          <div className="restaurant-header">
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="restaurant-image-large"
            />
            <div className="restaurant-info">
              <h1>{restaurant.name}</h1>
              <p>{restaurant.cuisine}</p>
              <p>{restaurant.address}</p>
            </div>
          </div>

          <hr className="divider" />

          {/* This form will now only appear if the user is the owner */}
          {isOwner && (
            <AddMenuItem
              restaurantId={restaurant._id}
              onMenuItemAdded={handleMenuItemAdded}
            />
          )}

          <div className="menu-section">
            <h2>Menu</h2>
            {menuItems.length === 0 ? (
              <p>No menu items have been added yet.</p>
            ) : (
              <div className="menu-items-grid">
                {menuItems.map((item) => (
                  <div key={item._id} className="menu-item-card">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="menu-item-footer">
                      <span className="menu-item-price">₹{item.price.toFixed(2)}</span>
                      <button
                        onClick={() => addToCart(item, restaurant)}
                        className="add-to-cart-btn"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <p>Restaurant not found.</p>
      )}
    </div>
  );
}

export default RestaurantDetailsPage;

