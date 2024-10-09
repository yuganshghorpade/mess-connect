'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';  // Use from 'next/navigation' in App Router
import { Button } from '@/components/ui/button';  // ShadCN button component
import { Input } from '@/components/ui/input';// ShadCN input component
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';  // Card components
import { CheckCircle, AlertCircle } from 'lucide-react';  // Icons from lucide-react
import { Loader2 } from 'lucide-react';  // Loader icon for submission state

const SetDailyMenu = () => {
  const [menu, setMenu] = useState('');  // Menu input state
  const [errorMessage, setErrorMessage] = useState('');  // Error message state
  const [successMessage, setSuccessMessage] = useState('');  // Success message state
  const [loading, setLoading] = useState(false);  // Loading state
  const router = useRouter();  // Correct useRouter hook for App Router

  const handleMenuChange = (e) => {
    setMenu(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading

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
      setErrorMessage(error.response?.data?.message || 'An error occurred while setting the menu.');
      setSuccessMessage('');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-100 via-white to-green-100">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-700">Set Daily Menu</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="menu" className="block text-sm font-medium text-gray-700 mb-2">Today's Menu:</label>
              <Input
                type="text"
                id="menu"
                value={menu}
                onChange={handleMenuChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. Panner, Salad"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 flex items-center justify-center space-x-2"
              disabled={loading}  // Disable button while loading
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
              <span>{loading ? 'Setting Menu...' : 'Set Menu'}</span>
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          {errorMessage && (
            <div className="mt-4 flex items-center text-red-600">
              <AlertCircle className="w-5 h-5 mr-2" />
              <p>{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="mt-4 flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-2" />
              <p>{successMessage}</p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SetDailyMenu;
