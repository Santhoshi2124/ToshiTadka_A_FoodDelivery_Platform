import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    setMenuOpen(false); // Close menu on logout
    navigate('/login');
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          ToshiTadka👩‍🍳🍗
        </Link>

        {/* Hamburger Menu Icon */}
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          <div className={menuOpen ? 'bar1 open' : 'bar1'}></div>
          <div className={menuOpen ? 'bar2 open' : 'bar2'}></div>
          <div className={menuOpen ? 'bar3 open' : 'bar3'}></div>
        </div>

        <ul className={menuOpen ? 'navbar-links active' : 'navbar-links'}>
          {userInfo ? (
            <>
              <li>
                <Link
                  to="/cart"
                  className="navbar-link cart-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Cart
                  {cartItemCount > 0 && (
                    <span className="cart-badge">{cartItemCount}</span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="/my-orders"
                  className="navbar-link"
                  onClick={() => setMenuOpen(false)}
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/add-restaurant"
                  className="navbar-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Add Restaurant
                </Link>
              </li>
              <li className="navbar-user mobile-only">
                Hello, {userInfo.name}
              </li>
              <li>
                <button onClick={logoutHandler} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="navbar-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="navbar-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* User info for desktop view */}
        {userInfo && (
          <div className="navbar-user-desktop">Hello, {userInfo.name}</div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

