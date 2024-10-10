'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Page() {
  const [fetchedMenus, setFetchedMenus] = useState([])  // Ensures fetchedMenus is always an array
  const [location, setLocation] = useState({})
  const [error, setError] = useState("")

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
          console.log("Response Data:", response.data);  // Log the full response for debugging
          if (response.data && response.data.dailyMenus) {
            setFetchedMenus(response.data.dailyMenus);
          } else {
            setError("No menus found in the response.");
          }
        } catch (err) {
          console.error("Error fetching menus:", err);
          setError('Failed to fetch daily menu.');
        }
      };

      const handleError = (error) => {
        setError(error.message);
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };
    fetchLocation();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Today's Daily Menu</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(fetchedMenus) && fetchedMenus.length > 0 ? (
          fetchedMenus.map((menu, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{menu.mess?.name || 'No Mess Name'}</h2>
              <p className="text-gray-700">{menu.mess?.address || 'No Address'}</p>
              <p className="text-gray-700 font-bold">{menu.menu || 'No Menu Available'}</p>
              <p className="text-gray-600 mt-2">Contact: {menu.mess?.contactNo || 'No Contact'}</p>
              <p className="text-gray-600">Open Hours: {menu.mess?.openHours || 'Not available'}</p>
              <p className="text-gray-600">
                {menu.mess?.isPureVegetarian ? 'Pure Vegetarian' : 'Non-Vegetarian Options'}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No menus available for your location.</p>
        )}
      </div>
    </div>
  )
}

export default Page;
