import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './CheckoutPage.css';

function CheckoutPage() {
  const { userInfo } = useContext(AuthContext);
  const {
    cartItems,
    restaurant,
    shippingAddress,
    totalPrice,
    saveShippingAddress,
    clearCart,
  } = useContext(CartContext);

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const fullShippingAddress = { address, city, postalCode, country };
    saveShippingAddress(fullShippingAddress);

    const order = {
      orderItems: cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
        menuItem: item._id,
      })),
      restaurant: restaurant._id,
      shippingAddress: fullShippingAddress,
      totalPrice: totalPrice,
    };

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post('http://localhost:5000/api/orders', order, config);

      clearCart();
      // In a real app, you would redirect to an order success page or payment page
      alert('Order placed successfully!');
      navigate('/');
    } catch (err) {
      setError('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-content">
        <div className="shipping-form">
          <h2>Shipping Address</h2>
          <form onSubmit={submitHandler}>
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
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                placeholder="Enter postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                placeholder="Enter country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>

        <div className="order-summary-checkout">
          <h2>Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item._id} className="summary-item">
              <span>
                {item.qty} x {item.name}
              </span>
              <span>₹{(item.qty * item.price).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row total-price">
            <span>Total</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
