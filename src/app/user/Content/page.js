'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Link from 'next/link';

export default function Content() {
  const [localMess, setLocalMess] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user's current location using Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Fetch local mess daily menu data from backend using Axios
          const response = await axios.get('/api/dailymenu/fetching-dailymenu', {
            params: { latitude, longitude },
          });

          if (response.data.success) {
            setLocalMess(response.data.response);
          } else {
            setError(response.data.message);
          }

        } catch (err) {
          setError("Error fetching daily menu: " + err.message);
        } finally {
          setLoading(false);
        }

      }, (error) => {
        setError("Unable to retrieve location: " + error.message);
        setLoading(false);
      });
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  return (
    <div className="container py-8">
      <div>
        <h2 className="text-center text-3xl font-semibold text-gray-800 mb-4">
          Local Messes Near You
        </h2>
        
        {loading ? (
          <p>Loading local messes...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-4 my-5">
            {localMess.length > 0 ? (
              localMess.map((menu, index) => (
                <Card key={index} className="shadow-lg rounded-lg overflow-hidden">
                  <div className="relative w-full h-48">
                    <Image
                      src={menu.mess.image} 
                      alt={menu.mess.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Mess Details */}
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold">{menu.mess.name}</h3>
                    <p className="text-gray-600 mt-2">{menu.mess.description}</p>

                    {/* Daily Menu */}
                    <div className="mt-4">
                      <h4 className="text-md font-semibold">Today's Menu:</h4>
                      <ul className="list-disc list-inside text-gray-700 mt-2">
                        {menu.menuItems && Array.isArray(menu.menuItems) && menu.menuItems.length > 0 ? (
                          menu.menuItems.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))
                        ) : (
                          <li>No menu available</li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center p-4 bg-gray-100">
                    <span className="text-gray-600 text-sm">{menu.mess.location}</span>

                    <Link href={`/mess/${menu.mess._id}`}>
                      <Button className="bg-blue-500 text-white">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p>No nearby messes found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
