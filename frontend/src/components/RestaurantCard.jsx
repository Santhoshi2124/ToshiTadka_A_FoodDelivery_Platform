import React from 'react';
import { Link } from 'react-router-dom';
import './RestaurantCard.css';

const placeholderImage = 'https://placehold.co/600x400/E2E8F0/475569?text=Restaurant';

function RestaurantCard({ restaurant }) {
  return (
    <Link to={`/restaurants/${restaurant._id}`} className="restaurant-card">
      <img
        src={restaurant.imageUrl || placeholderImage}
        alt={restaurant.name}
        className="restaurant-card-img"
      />
      <div className="restaurant-card-body">
        <h3 className="restaurant-card-title">{restaurant.name}</h3>
        <p className="restaurant-card-cuisine">{restaurant.cuisine}</p>
        <p className="restaurant-card-address">{restaurant.address}</p>
      </div>
    </Link>
  );
}

export default RestaurantCard;

