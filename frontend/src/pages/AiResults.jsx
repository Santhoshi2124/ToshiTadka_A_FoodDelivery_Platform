import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';
import './AiResults.css';

function CravingsResultsPage() {
  const [searchParams] = useSearchParams();
  const craving = searchParams.get('q');

  const [suggestedDishes, setSuggestedDishes] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!craving) return;

    const fetchCravingResults = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:5000/api/ai/solve-craving?craving=${craving}`
        );
        setSuggestedDishes(data.suggestedDishes);
        setRestaurants(data.restaurants);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not process your craving.');
      } finally {
        setLoading(false);
      }
    };

    fetchCravingResults();
  }, [craving]);

  return (
    <div className="cravings-results-container">
      <h1 className="cravings-results-title">
        For your craving: "<em>{craving}</em>"
      </h1>
      {loading ? (
        <div>Thinking of the perfect dish for you...</div>
      ) : error ? (
        <div className="cravings-results-error">{error}</div>
      ) : (
        <>
          <p className="cravings-results-subtitle">
            Our AI suggests you might enjoy:{' '}
            <strong>{suggestedDishes.join(', ')}</strong>. Here are some
            restaurants that serve these dishes:
          </p>
          {restaurants.length > 0 ? (
            <div className="restaurants-grid">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <p>
              Sorry, we couldn't find any restaurants matching your craving.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default CravingsResultsPage;
