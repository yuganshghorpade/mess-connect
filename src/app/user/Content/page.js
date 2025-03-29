'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 

export default function Content() {
  const [localMess, setLocalMess] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(null); 
  const router = useRouter(); 
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.post(`/api/mess/fetch-nearby-messes`, {
            latitude:latitude,
            longitude:longitude
          }, {
            withCredentials: true
          });
          console.log("fetchhing mess response",response)
          if (response.data.success) {
            setLocalMess(response.data.messes);
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

  const handleViewDetails = (id) => {
    setLoadingDetails(id); // Set loading for the specific mess
    router.push(`/mess/${id}`); // Navigate to the details page
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div>
        <h2 className="text-center text-4xl font-bold text-gray-900 mb-8">
          Local Messes Near You
        </h2>
        
        {loading ? (
          <p className="text-center text-gray-600">Loading local messes...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {localMess && localMess.length > 0 ? (
              localMess.map((menu, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden bg-white">
                  <div className="relative w-full h-48">
                    <Image
                      src="/food2.jpeg"
                      alt="mess image"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Mess Details */}
                  <CardContent className="p-6 mb-5">
                    <h3 className="text-2xl font-semibold text-gray-800">{menu.name}</h3>
                    <p className="text-gray-600 mt-2">{menu.address}</p>

                  </CardContent>
                  
                  <CardFooter className="flex justify-between items-center p-4 bg-gray-100">
                    <Button 
                      onClick={() => handleViewDetails(menu._id)} 
                      className="bg-green-600 hover:bg-green-400 text-white py-2 px-4 rounded-lg"
                      disabled={loadingDetails === menu._id} 
                    >
                      {loadingDetails === menu._id ? "Loading..." : "View Details"}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-600">No nearby messes found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
