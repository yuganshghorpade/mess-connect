'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Header from '../header/page'
import Footer from '@/components/ui/footer'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Loader, AlertCircle, MapPin, Phone, Clock, Leaf } from 'lucide-react'

function Page() {
  const [fetchedMenus, setFetchedMenus] = useState([])  // Ensures fetchedMenus is always an array
  const [location, setLocation] = useState({})
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true) // Added loading state

  useEffect(() => {
    const fetchLocation = async () => {
      const handleSuccess = async (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        try {
          const response = await axios.get(`/api/dailymenu/fetching-dailymenu?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`, {
            withCredentials: true,
          });
          setLoading(false);
          if (response.data && response.data.dailyMenus) {
            setFetchedMenus(response.data.dailyMenus);
          } else {
            setError("No menus found in the response.");
          }
        } catch (err) {
          console.error("Error fetching menus:", err);
          setError('Failed to fetch daily menu.');
          setLoading(false);
        }
      };

      const handleError = (error) => {
        setError(error.message);
        setLoading(false);
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      } else {
        setError("Geolocation is not supported by this browser.");
        setLoading(false);
      }
    };
    fetchLocation();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-green-100 via-white to-green-100">
  <Header />

  <div className="flex-grow flex flex-col items-center justify-center p-6">
    <h1 className="text-4xl sm:text-5xl font-bold text-green-800 mb-8">
      Today's Daily Menu
    </h1>

    {loading ? (
      <div className="flex items-center justify-center">
        <Loader className="animate-spin w-10 h-10 text-green-600" />
      </div>
    ) : error ? (
      <div className="flex items-center text-red-500 bg-red-100 p-4 rounded-lg shadow-md">
        <AlertCircle className="w-6 h-6 mr-2 text-red-600" />
        <p className="text-base font-medium">{error}</p>
      </div>
    ) : fetchedMenus.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {fetchedMenus.map((menu, index) => (
          <Card
            key={index}
            className="shadow-lg border border-green-200 bg-white rounded-lg hover:shadow-xl transition-transform duration-200 hover:scale-[1.03]"
          >
            <CardHeader className="bg-green-50 p-5 rounded-t-lg border-b border-green-200">
              <CardTitle className="text-2xl font-semibold text-green-700">
                {menu.mess?.name || 'No Mess Name'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                <p>{menu.mess?.address || 'No Address'}</p>
              </div>
              <div className="text-lg font-bold text-gray-900 flex items-center">
                <menu className="w-5 h-5 text-green-600 mr-2" />
                <p>Menu: {menu.menu || 'No Menu Available'}</p>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-5 h-5 mr-2 text-green-600" />
                <p>{menu.mess?.contactNo || 'No Contact'}</p>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2 text-green-600" />
                <p>{menu.mess?.openHours || 'Not available'}</p>
              </div>
              <div className="flex items-center text-gray-600">
                <Leaf className="w-5 h-5 mr-2 text-green-600" />
                <p>{menu.mess?.isPureVegetarian ? 'Pure Vegetarian' : 'Non-Vegetarian Options'}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <p className="text-xl text-gray-600">
        No menus available for your location.
      </p>
    )}
  </div>

  <Footer className="bg-green-50 mt-10 p-4 border-t border-green-200" />
</div>


  );
}

export default Page;
