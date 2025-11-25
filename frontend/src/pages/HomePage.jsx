import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';
import CravingsSearch from '../components/AiCravingSearch'; // Import the new component
import './HomePage.css';

function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:5000/api/restaurants?keyword=${keyword}`
        );
        setRestaurants(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [keyword]);

  return (
    <div className="home-container">
      {/* --- THIS IS THE NEW COMPONENT --- */}
      <CravingsSearch />

      <h3 className="home-title">
        {keyword ? `Results for "${keyword}"` : 'Handpicked Restaurants for You✨'}
      </h3>
      {error ? (
        <div className="home-error">{error}</div>
      ) : loading ? (
        <div>Loading restaurants...</div>
      ) : restaurants.length === 0 ? (
        <div className="home-error">
          No restaurants found. Try a different search.
        </div>
      ) : (
        <div className="restaurants-grid">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;

