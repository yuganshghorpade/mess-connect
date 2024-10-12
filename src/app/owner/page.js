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
        const fetchlocation = async()=> {
            const handleSuccess = async (position) => {
                setLocation({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
                const response = await axios.patch("/api/user/updating-user-details",{
                    longitude: position.coords.latitude,
                    latitude: position.coords.longitude,
                },{
                  withCredentials:true
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
        fetchlocation();
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200">
            {/* Header Component */}
            <Header />

            {/* Main Content */}
            <main className="flex-grow">
                <section className="bg-gray-800 py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-5xl font-extrabold text-white mb-6">
                            Welcome to Tastebuddies
                        </h1>
                        <p className="text-xl text-gray-400 mb-12">
                            You can update your daily menu on our website, making it easier for more customers to discover your mess.
                        </p>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-white py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                            {/* Feature 1 */}
                            <div className="bg-gray-800 p-10 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                                <h3 className="text-3xl font-bold text-white mb-4">
                                    Daily Menu Updates
                                </h3>
                                <p className="text-gray-400 mb-6">
                                    Mess owners can easily update their daily menus, offering fresh meal options for users.
                                </p>
                              
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-gray-800 p-10 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                                <h3 className="text-3xl font-bold text-white mb-4">
                                    Custom Meal Plans
                                </h3>
                                <p className="text-gray-400 mb-6">
                                    Users can subscribe to a variety of meal plans tailored to their dietary preferences.
                                </p>
                                
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-gray-800 p-10 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                                <h3 className="text-3xl font-bold text-white mb-4">
                                    Mess Subscription
                                </h3>
                                <p className="text-gray-400 mb-6">
                                    Convenient subscription options allow users to select messes based on their location and meals.
                                </p>
                               
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer Component */}
            <Footer />
        </div>
    );
}
