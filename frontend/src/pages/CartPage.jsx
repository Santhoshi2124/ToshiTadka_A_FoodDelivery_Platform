import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './CartPage.css';

function CartPage() {
  const {
    cartItems,
    restaurant,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    addToCart,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const checkoutHandler = () => {
    // We navigate to the checkout page, which is protected.
    // If the user isn't logged in, they'll be redirected to the login page first.
    navigate('/checkout');
  };

  return (
    <div className="cart-container">
      {/* <h1>Your Cart</h1><br></br> */}
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          Your cart is empty. <br></br><Link to="/">Go Back To Restaurants</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-list">
            <h2>Items from {restaurant?.name || 'your selected restaurant'}</h2>
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>${item.price.toFixed(2)}</p>
                </div>
                <div className="cart-item-actions">
                  <button onClick={() => removeFromCart(item)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => addToCart(item, restaurant)}>+</button>
                </div>
              </div>
            ))}
            <button onClick={clearCart} className="clear-cart-btn">
              Clear Cart
            </button>
          </div>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Items</span>
              <span>₹{itemsPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>₹{shippingPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>₹{taxPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <button
              className="checkout-btn"
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;

