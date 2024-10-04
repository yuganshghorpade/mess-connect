'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';  // Use from 'next/navigation' in App Router

const SetDailyMenu = () => {
  const [menu, setMenu] = useState('');  // Menu input state
  const [errorMessage, setErrorMessage] = useState('');  // Error message state
  const [successMessage, setSuccessMessage] = useState('');  // Success message state
  const router = useRouter();  // Correct useRouter hook for App Router

  const handleMenuChange = (e) => {
    setMenu(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     
      const response = await axios.post('/api/dailymenu/dailymenu-creation', 
        { menu }, 
        {
          withCredentials:true
        }
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setErrorMessage('');
        
      } else {
        setErrorMessage(response.data.message);
        setSuccessMessage('');
      }

    } catch (error) {
      // Handle error
      setErrorMessage(error.response?.data?.message || 'An error occurred while setting the menu.');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h1>Set Daily Menu</h1>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="menu">Menu:</label>
          <input
            type="text"
            id="menu"
            value={menu}
            onChange={handleMenuChange}
            placeholder="Enter today's menu"
            required
          />
        </div>

        <button type="submit">Set Menu</button>
      </form>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default SetDailyMenu;
