import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AiCravingSearch.css';

function CravingsSearch() {
  const [craving, setCraving] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (craving.trim()) {
      // Navigate to a new results page with the craving as a query
      navigate(`/cravings-results?q=${craving}`);
    }
  };

  return (
    <div className="cravings-container">
      <h2 className="cravings-title">What are you craving, Santhoshi?</h2>
      <p className="cravings-subtitle">
        Describe what you feel like eating, and we'll find the perfect dish.
      </p>
      <form onSubmit={submitHandler} className="cravings-form">
        <input
          type="text"
          value={craving}
          onChange={(e) => setCraving(e.target.value)}
          placeholder="e.g., 'Something cheesy and crispy for a snack...'"
          className="cravings-input"
        />
        <button type="submit" className="cravings-button">
          Find Food
        </button>
      </form>
    </div>
  );
}

export default CravingsSearch;
