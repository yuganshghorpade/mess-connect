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
          fetchlocation()
          
        //   const response = await axios.patch("/api/user/updating-user-details",{
        //     longitude: location.longitude,
        //     latitude: location.latitude
        //   })
    }

    return<div className="flex flex-col min-h-screen bg-gray-50">
    {/* Header Component */}
    <Header />

    {/* Main Content */}
    <main className="flex-grow">
        <section className="bg-white py-16">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Tastebuddies</h1>
                <p className="text-lg text-gray-600 mb-8">
                    You can update your daily menu on our website allows more customers to know about your mess.
                </p>
                <div className="flex justify-center">
                    {/* <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition">
                        Explore Messes
                    </button> */}
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="bg-blue-50 py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {/* Feature 1 */}
                    <div className="bg-white p-8 rounded-md shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Daily Menu Updates</h3>
                        <p className="text-gray-600 mb-6">
                            Mess owners can easily update their daily menus, offering fresh meal options for users.
                        </p>
                        {/* <img src="/images/menu-update.png" alt="Menu Update" className="w-full h-48 object-cover rounded-md" /> */}
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white p-8 rounded-md shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Custom Meal Plans</h3>
                        <p className="text-gray-600 mb-6">
                            Users can subscribe to a variety of meal plans tailored to their dietary preferences.
                        </p>
                        {/* <img src="/images/meal-plan.png" alt="Meal Plan" className="w-full h-48 object-cover rounded-md" /> */}
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white p-8 rounded-md shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Mess Subscription</h3>
                        <p className="text-gray-600 mb-6">
                            Convenient subscription options allow users to select messes based on their location and meals.
                        </p>
                        {/* <img src="/images/subscription.png" alt="Mess Subscription" className="w-full h-48 object-cover rounded-md" /> */}
                    </div>
                </div>
            </div>
        </section>

        {/* Call to Action */}
        {/* <section className="bg-blue-600 py-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Join Mess Connection Today!</h2>
            <p className="text-lg mb-6">Start subscribing to your favorite mess and enjoy delicious meals every day.</p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition">
                Get Started
            </button>
        </section> */}
    </main>

    {/* Footer Component */}
    <Footer />
</div>

  
}
