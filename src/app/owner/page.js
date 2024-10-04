"use client";
import Header from "./header/page";
import axios from "axios";
import { useEffect, useState } from "react";
import Footer from "@/components/ui/footer";
import SetDailyMenu from "./menuCreation/page";

export default function Owner() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [location, setLocation] = useState({ latitude: null, longitude: null });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // const token = getCookie('accessToken');

                // Make a request to the backend, including the token in the Authorization header
                const response = await axios.get(
                    "/api/user/fetching-user-details",
                    {
                        withCredentials: true,
                    }
                );
                console.log(response);
                // Check if response data contains user information
                if (response.data.success) {
                    setUserData(response.data.response);
                } else {
                    setError(
                        response.data.message || "Failed to load user data."
                    );
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to load user data. Error: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const setMessLocation = async () => {
        const fetchlocation = async()=>{
              const handleSuccess = async (position) => {
                setLocation({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
                const response = await axios.patch("/api/user/updating-user-details",{
                    longitude: position.coords.latitude,
                    latitude: position.coords.longitude,
                })
                console.log(response);
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
          
        //   const response = await axios.patch("/api/user/updating-user-details",{
        //     longitude: location.longitude,
        //     latitude: location.latitude
        //   })
    }

    return <div className="flex flex-col min-h-screen">
    <Header />
    
    <main className="flex-grow">
      {/* Main content goes here */}
      <button className="bg-green-400" onClick={setMessLocation}>Calibrate location</button>
            <SetDailyMenu/>
    </main>
  
    <Footer />
  </div>
  
}
