'use client';
import { useState } from 'react';
import axios from 'axios';



const SubscribeMess = () => {
  const [messId, setMessId] = useState(''); // Updated to messId
 const [mealType, setMealType] = useState('');
  const [duration, setDuration] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError(null);

    try {
      const durationInMilliseconds = parseInt(duration) * 24 * 60 * 60 * 1000; 
      const response = await axios.post('/api/subscriptions/create-subscription', {
        messId:messId,
        mealType:mealType,
        durationInMilliseconds:durationInMilliseconds
    });
    
      if (response.data.success) {
        setMessage(response.data.message);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('An error occurred while subscribing.');
      console.log(error)
    }
  };

  return (
    <div>
      <h1>Subscribe to Mess</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="messId">Mess ID:</label>
          <input
            type="text"
            id="messId"
            value={messId} // Updated state to messId
            onChange={(e) => setMessId(e.target.value)} // Updated handler
            required
          />
        </div>
        <div>
          <label htmlFor="mealType">Meal Type:</label>
          <input
            type="text"
            id="mealType"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="duration">Duration (in days):</label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        <button type="submit">Subscribe</button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SubscribeMess;
