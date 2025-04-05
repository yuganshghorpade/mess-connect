"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "../header/page";
import Footer from "@/components/ui/footer";
import { MapPinIcon, UserCircleIcon, CalendarIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);
    const [errorUser, setErrorUser] = useState("");
    const [errorSubscriptions, setErrorSubscriptions] = useState("");
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState("");
    const [loadingDetails, setLoadingDetails] = useState(null);
    const router = useRouter();

    const setMessLocation = async () => {
        setLoadingDetails("location");
        const fetchLocation = async () => {
            const handleSuccess = async (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });

                try {
                    const response = await axios.patch("/api/user/updating-user-details", {
                        longitude: position.coords.longitude,
                        latitude: position.coords.latitude,
                    });
                    console.log(response);
                    setLoadingDetails(null);
                } catch (err) {
                    console.error("Error updating user details:", err);
                    setLocationError("Failed to update location. " + err.message);
                    setLoadingDetails(null);
                }
            };

            const handleError = (error) => {
                setLocationError(error.message);
                setLoadingDetails(null);
            };
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                });
            } else {
                setLocationError("Geolocation is not supported by this browser.");
                setLoadingDetails(null);
            }
        };

        fetchLocation();
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("/api/user/fetching-user-details", {
                    withCredentials: true,
                });
                console.log(response);
                if (response.data.success) {
                    setUserData(response.data.response);
                } else {
                    setErrorUser(response.data.message || "Failed to load user data.");
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setErrorUser("Failed to load user data. Error: " + err.message);
            } finally {
                setLoadingUser(false);
            }
        };

        const fetchSubscriptions = async () => {
            try {
                const response = await axios.get("/api/subscriptions/fetch-subscriptions", {
                    withCredentials: true
                });
                console.log(response);
                if (response.data.success) {
                    setSubscriptions(response.data.response);
                } else {
                    setErrorSubscriptions(response.data.message || "Failed to load subscriptions.");
                }
            } catch (error) {
                console.error("Error fetching subscriptions:", error);
                setErrorSubscriptions("Failed to load subscriptions. Error: " + error.message);
            } finally {
                setLoadingSubscriptions(false);
            }
        };

        fetchUserData();
        fetchSubscriptions();
    }, []);

    if (loadingUser || loadingSubscriptions) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-lg font-medium text-gray-700">Loading your profile...</p>
            </div>
        );
    }

    if (errorUser) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-red-50">
                <ExclamationCircleIcon className="w-16 h-16 text-red-500 mb-4" />
                <div className="text-red-600 text-xl font-semibold text-center max-w-md">
                    {errorUser}
                </div>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            <Header />
            <main className="flex-grow">
                <div className="max-w-6xl mx-auto p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 relative">
                            My Profile
                            <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-blue-500 rounded-full"></span>
                        </h1>
                        
                        {userData && userData.type === "mess" && (
                            <button
                                className={`mt-4 md:mt-0 flex items-center px-4 py-2 rounded-lg shadow-md text-white font-medium transition-all 
                                ${loadingDetails === "location" 
                                    ? "bg-gray-400 cursor-not-allowed" 
                                    : "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 hover:shadow-lg"}`}
                                onClick={setMessLocation}
                                disabled={loadingDetails === "location"}
                            >
                                {loadingDetails === "location" ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating location...
                                    </>
                                ) : (
                                    <>
                                        <MapPinIcon className="w-5 h-5 mr-2" />
                                        Update Location
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {userData && (
                        <div className="mb-10">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                                    <div className="flex items-center">
                                        <div className="bg-white rounded-full p-2 mr-4 shadow-md">
                                            <UserCircleIcon className="w-16 h-16 text-blue-500" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold mb-1">
                                                {userData.messName || userData.username}
                                            </h2>
                                            <p className="text-blue-100 text-sm">
                                                {userData.type === "mess" ? "Mess Provider" : "Mess"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-start">
                                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                                    <svg className="w-5 h-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 font-medium">Email</p>
                                                    <p className="text-gray-800">{userData.email}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start">
                                                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                                    <svg className="w-5 h-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 font-medium">Contact</p>
                                                    <p className="text-gray-800">{userData.contactNo || "Not provided"}</p>
                                                </div>
                                            </div>

                                            {userData.type === "mess" && (
                                                <div className="flex items-start">
                                                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                                                        <MapPinIcon className="w-5 h-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 font-medium">Location</p>
                                                        <p className="text-gray-800">
                                                            {userData.location && userData.location.coordinates
                                                                ? `Lat: ${userData.location.coordinates[0].toFixed(5)}, Long: ${userData.location.coordinates[1].toFixed(5)}`
                                                                : "Location not available"}
                                                        </p>
                                                        {locationError && (
                                                            <p className="text-red-500 text-sm mt-1">{locationError}</p>
                                                        )}
                                                        {location && !locationError && (
                                                            <p className="text-green-500 text-sm mt-1">Location updated successfully!</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="flex items-start">
                                                <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                                                    <MapPinIcon className="w-5 h-5 text-yellow-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 font-medium">Address</p>
                                                    <p className="text-gray-800">{userData.address || "No address provided"}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start">
                                                <div className="bg-red-100 p-2 rounded-lg mr-3">
                                                    <svg className="w-5 h-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 font-medium">Description</p>
                                                    <p className="text-gray-800">{userData.description || "No description provided"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Subscriptions Section */}
                    <div className="mb-10">
                        <div className="flex items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Your Subscriptions</h2>
                            <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                {subscriptions.length} {subscriptions.length === 1 ? 'subscription' : 'subscriptions'}
                            </div>
                        </div>
                        
                        {errorSubscriptions ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                                {errorSubscriptions}
                            </div>
                        ) : subscriptions.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {subscriptions.map((subscription) => (
                                    <div
                                        key={subscription._id}
                                        className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
                                    >
                                        <div className={`p-2 text-center text-white font-medium 
                                            ${subscription.status === "Active" 
                                                ? "bg-gradient-to-r from-green-400 to-green-600" 
                                                : "bg-gradient-to-r from-gray-400 to-gray-600"}`}
                                        >
                                            {subscription.status}
                                        </div>
                                        
                                        <div className="p-5">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {subscription.user.username}
                                                </h3>
                                                <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                                                    {subscription.user.contactNo}
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3 mb-4">
                                                <div className="flex items-center text-gray-600">
                                                    <CalendarIcon className="w-4 h-4 mr-2 text-green-500" />
                                                    <span className="text-sm">Start: {new Date(subscription.startDate).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    })}</span>
                                                </div>
                                                
                                                <div className="flex items-center text-gray-600">
                                                    <CalendarIcon className="w-4 h-4 mr-2 text-red-500" />
                                                    <span className="text-sm">End: {new Date(subscription.expiry).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    })}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4">
                                                <button
                                                    onClick={() => router.push(subscription?._id)}
                                                    className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium shadow-md hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center justify-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    Extend Subscription
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow p-8 text-center">
                                <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Subscriptions Found</h3>
                                <p className="text-gray-600 mb-6">You don't have any active subscriptions at the moment.</p>
                                <button 
                                    onClick={() => router.push('/browse')}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                                >
                                    Browse Available Subscriptions
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}