import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './MyOrders.css';

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);

        // --- THIS IS THE CRUCIAL PART ---
        // We create a config object with the Authorization header.
        // The token proves to the backend that the user is logged in.
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(
          'http://localhost:5000/api/orders/myorders',
          config // Pass the config object with the token to axios
        );

        setOrders(data);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    // Only attempt to fetch orders if the user is logged in
    if (userInfo) {
      fetchMyOrders();
    }
  }, [userInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="my-orders-container">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <h3>Order ID: {order._id}</h3>
              <p>
                Date:{' '}
                {new Date(order.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
            <div className="order-body">
              {order.orderItems.map((item) => (
                <div key={item._id} className="order-item">
                  <span>{item.name}</span>
                  <span>
                    {item.qty} x ₹{item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="order-footer">
              <strong>Total: ₹{order.totalPrice.toFixed(2)}</strong>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrdersPage;

