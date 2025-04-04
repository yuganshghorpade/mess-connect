"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "../header/page";
import Footer from "@/components/ui/footer";
import { MapPinIcon } from '@heroicons/react/24/solid';

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);
    const [errorUser, setErrorUser] = useState("");
    const [errorSubscriptions, setErrorSubscriptions] = useState("");
    const [location, setLocation] = useState(null); // Added
    const [locationError, setLocationError] = useState(""); // Added
    const router = useRouter();

    const setMessLocation = async () => {
        const fetchLocation = async () => {
            const handleSuccess = async (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });

                try {
                    const response = await axios.patch("/api/user/updating-user-details", {
                        longitude: position.coords.longitude, // Corrected
                        latitude: position.coords.latitude,   // Corrected
                    });
                    console.log(response);
                } catch (err) {
                    console.error("Error updating user details:", err);
                    setLocationError("Failed to update location. " + err.message);
                }
            };

            const handleError = (error) => {
                setLocationError(error.message);
            };

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                });
            } else {
                setLocationError("Geolocation is not supported by this browser.");
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
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (errorUser) {
        return <div className="text-red-500 text-center mt-4">{errorUser}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow">
                <div className="container mx-auto p-6 sm:p-8 lg:p-12">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
                        Profile Page
                    </h1>
                    {userData ? (
                        <div className="bg-white shadow-lg rounded-lg p-8 sm:p-10 lg:p-12 mb-8">
                            <div className="flex items-center mb-6">
                                {/* User Icon */}
                                <div className="bg-gray-200 rounded-full p-2 mr-4">
                                    <svg
                                        className="w-10 h-10 text-gray-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5.121 17.804A13.937 13.937 0 0112 15.944c3.122 0 6.008 1.097 8.121 2.86M12 12a5 5 0 100-10 5 5 0 000 10zm0 2a9 9 0 00-9 9h18a9 9 0 00-9-9z"
                                        />
                                    </svg>
                                </div>
                                
                                {/* Username */}
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    {userData.username}
                                </h2>
                            </div>
                            <div className="text-gray-700 space-y-3">
                                <p>
                                    <strong>Email:</strong> {userData.email}
                                </p>
                                <p>
                                    <strong>Contact:</strong> {userData.contactNo}
                                </p>
                                <p>
                                    <strong>Description:</strong> {userData.description}
                                </p>
                                <p className="flex items-center">
                                    <MapPinIcon className="w-5 h-5 mr-2 text-green-600" />
                                    <strong>Address:</strong> {userData.address}
                                </p>

                                <button
                                    className="bg-green-400 p-3 rounded-md text-black"
                                    onClick={setMessLocation}
                                >
                                    Calibrate location
                                </button>
                                {locationError && (
                                    <div className="text-red-500 mt-2">
                                        {locationError}
                                    </div>
                                )}
                                {location && (
                                    <div className="mt-2 text-green-600">
                                        Location updated successfully!
                                    </div>
                                )}
                                {userData.type === "mess" && (
                                    <>
                                        <p>
                                            <strong>Mess Name:</strong> {userData.messName}
                                        </p>
                                        <p>
                                            <strong>Address:</strong> {userData.address}
                                        </p>
                                        <p className="flex items-center">
                                            <MapPinIcon className="w-5 h-5 mr-2 text-green-600" />
                                            <strong>Location:</strong>{" "}
                                            {userData.location && userData.location.coordinates
                                                ? `Lat: ${userData.location.coordinates[0]}, Long: ${userData.location.coordinates[1]}`
                                                : "Location not available"}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center text-lg">
                            No user data available.
                        </p>
                    )}

                    {/* Subscriptions Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Your Subscriptions
                        </h2>
                        {loadingSubscriptions ? (
                            <div>Loading subscriptions...</div>
                        ) : errorSubscriptions ? (
                            <div className="text-red-500">{errorSubscriptions}</div>
                        ) : subscriptions.length > 0 ? (
                            <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {subscriptions.map((subscription) => (
                                    <li
                                        key={subscription._id}
                                        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition-transform transform hover:scale-105"
                                    >
                                        <div className="flex justify-between">
                                        <p className="text-gray-900 font-semibold text-xl mb-2">
                                            {subscription.mess
                                                ? subscription.user.username
                                                : subscription.user.username}
                                        </p>
                                        <p className="text-gray-600 font-normal text-base mb-2">
                                            {subscription.mess
                                                ? subscription.user.contactNo
                                                : subscription.user.contactNo}
                                        </p>
                                        </div>
                                        <p className="text-gray-600 text-sm">
                                            <strong>Start Date:</strong>{" "}
                                            {new Date(subscription.startDate).toLocaleDateString()}
                                        </p>
                                        <p className="text-gray-600 text-sm mt-1">
                                            <strong>End Date:</strong>{" "}
                                            {new Date(subscription.expiry).toLocaleDateString()}
                                        </p>
                                        <p
                                            className={`mt-4 font-semibold text-lg ${
                                                subscription.isActive
                                                    ? "text-green-600"
                                                    : "text-green-600"
                                            }`}
                                        >
                                            {subscription.status}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center text-lg">
                                No subscriptions found.
                            </p>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
