'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';  
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'; 
import { CheckCircle, AlertCircle } from 'lucide-react';  
import { Loader2 } from 'lucide-react'; 

const SetDailyMenu = () => {
  const [menu, setMenu] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');  
  const [successMessage, setSuccessMessage] = useState(''); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();  

  const handleMenuChange = (e) => {
    setMenu(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-200 via-white to-green-200">
  <Card className="w-full max-w-lg bg-white shadow-xl rounded-2xl transform transition-all hover:shadow-2xl">
    <CardHeader className="text-center py-6">
      <CardTitle className="text-4xl font-extrabold text-gray-800">Set Daily Menu</CardTitle>
    </CardHeader>

    <CardContent className="px-8 py-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <label htmlFor="menu" className="block text-base font-semibold text-gray-700 mb-3">
            Today's Menu:
          </label>
          <Input
            type="text"
            id="menu"
            value={menu}
            onChange={handleMenuChange}
            className="w-full h-16 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
            placeholder="e.g. Paneer, Salad"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center space-x-3"
          disabled={loading} 
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <CheckCircle className="w-6 h-6" />
          )}
          <span>{loading ? 'Setting Menu...' : 'Set Menu'}</span>
        </Button>
      </form>
    </CardContent>

    <CardFooter className="px-8 py-6">
      {errorMessage && (
        <div className="mt-4 flex items-center text-red-600">
          <AlertCircle className="w-6 h-6 mr-2" />
          <p className="text-lg">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="mt-4 flex items-center text-green-600">
          <CheckCircle className="w-6 h-6 mr-2" />
          <p className="text-lg">{successMessage}</p>
        </div>
      )}
    </CardFooter>
  </Card>
</div>

  );
};

export default SetDailyMenu;
