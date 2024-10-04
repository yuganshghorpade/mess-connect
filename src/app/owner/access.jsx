'use client'
import axios from "axios";
import React, { useEffect, useState } from "react";

function Access() {

    const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [accuracy, setAccuracy] = useState(null); // Added to show accuracy

  useEffect(() => {
    const fetchlocation = async()=>{
        const handleSuccess = (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setAccuracy(position.coords.accuracy); // Update accuracy
        };
    
        const handleError = (error) => {
          setError(error.message);
        };
    
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
            enableHighAccuracy: true, // Request higher accuracy
            timeout: 5000, // Set a timeout (5 seconds in this case)
            maximumAge: 0 // Do not use a cached position
          });
        } else {
          setError("Geolocation is not supported by this browser.");
        }
    }
    fetchlocation()
  }, []);

  console.log(location.latitude, location.longitude);
    useEffect(() => {
        const fetchMesses = async () => {
            try {
                const response = await axios.post(
                    "/api/mess/fetch-nearby-messes",
                    {
                        latitude : location.latitude,
                        longitude : location.longitude,
                    },{
                        withCredentials:true
                    }
                );
                console.log(response);
            } catch (error) {
                console.error(error)
            }
        };
        fetchMesses()
    }, [location]);

    return <div>
        {location.latitude}, {location.longitude}</div>;
}

export default Access;
