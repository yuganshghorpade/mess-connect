"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../header/page";
import Footer from "@/components/ui/footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Loader,
    AlertCircle,
    MapPin,
    Phone,
    Clock,
    Leaf,
    Utensils,
} from "lucide-react";

function Page() {
    const [fetchedMenus, setFetchedMenus] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocation = async () => {
            const handleSuccess = async (position) => {
                try {
                    const response = await axios.get(
                        `/api/dailymenu/fetching-dailymenu?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`,
                        { withCredentials: true }
                    );
                    setLoading(false);
                    if (response.data && response.data.dailyMenus) {
                        setFetchedMenus(response.data.dailyMenus);
                    } else {
                        setError("No menus found in the response.");
                    }
                } catch (err) {
                    console.error("Error fetching menus:", err);
                    setError("Failed to fetch daily menu.");
                    setLoading(false);
                }
            };

            const handleError = (error) => {
                setError(error.message);
                setLoading(false);
            };

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    handleSuccess,
                    handleError,
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0,
                    }
                );
            } else {
                setError("Geolocation is not supported by this browser.");
                setLoading(false);
            }
        };
        fetchLocation();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100 text-gray-800">
            <Header />

            <main className="flex-grow flex flex-col items-center px-6 py-12 w-full">
                <h1 className="text-5xl font-extrabold text-green-700 mb-12 shadow-md p-4 rounded-lg bg-white">
                    Today's Menu
                </h1>

                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader className="animate-spin w-14 h-14 text-green-600" />
                    </div>
                ) : error ? (
                    <div className="flex items-center text-red-500 bg-red-100 p-6 rounded-lg shadow-lg w-full max-w-lg border border-red-300">
                        <AlertCircle className="w-7 h-7 mr-3 text-red-600" />
                        <p className="text-lg font-semibold">{error}</p>
                    </div>
                ) : fetchedMenus.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl">
                        {fetchedMenus.map((menu, index) => (
                            <Card
                                key={index}
                                className="shadow-xl border border-green-300 bg-white rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                            >
                                <CardHeader className="bg-green-200 p-6 border-b border-green-300">
                                    <CardTitle className="text-2xl font-semibold text-green-800">
                                        {menu.mess?.name || "No Mess Name"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-5">
                                    <div className="flex items-center text-gray-700 font-medium">
                                        <MapPin className="w-5 h-5 mr-2 text-green-600" />
                                        <p>
                                            {menu.mess?.address || "No Address"}
                                        </p>
                                    </div>
                                    <div className="flex items-center text-lg text-gray-900">
                                        <Utensils className="w-5 h-5 text-green-600 mr-2" />
                                        <p>
                                            Menu:{" "}
                                            {menu.menu || "No Menu Available"}
                                        </p>
                                    </div>
                                    <div className="flex items-center text-gray-600 font-medium">
                                        <Phone className="w-5 h-5 mr-2 text-green-600" />
                                        <p>
                                            {menu.mess?.contactNo ||
                                                "No Contact"}
                                        </p>
                                    </div>
                                    <div className="flex items-center text-gray-600 font-medium">
                                        <Clock className="w-5 h-5 mr-2 text-green-600" />
                                        {(() => {
                                            if (!menu.mess?.createdAt)
                                                return <p>Not available</p>;

                                            const dateObj = new Date(
                                                menu.mess.createdAt
                                            );

                                            // Extract date
                                            const dd = String(
                                                dateObj.getDate()
                                            ).padStart(2, "0");
                                            const mm = String(
                                                dateObj.getMonth() + 1
                                            ).padStart(2, "0");
                                            const yyyy = dateObj.getFullYear();
                                            const formattedDate = `${dd}/${mm}/${yyyy}`;

                                            // Extract time (12-hour format with AM/PM)
                                            let hours = dateObj.getHours();
                                            const minutes = String(
                                                dateObj.getMinutes()
                                            ).padStart(2, "0");
                                            const ampm =
                                                hours >= 12 ? "PM" : "AM";
                                            hours = hours % 12 || 12; // Convert 24-hour to 12-hour format
                                            const formattedTime = `${hours}:${minutes} ${ampm}`;

                                            return (
                                                <p>
                                                    {formattedDate} |{" "}
                                                    {formattedTime}
                                                </p>
                                            );
                                        })()}
                                    </div>
                                    <div className="flex items-center text-gray-600 font-medium">
                                        <Leaf className="w-5 h-5 mr-2 text-green-600" />
                                        <p>
                                            {menu.mess?.isPureVegetarian
                                                ? "🌱 Pure Vegetarian"
                                                : "🍗 Non-Vegetarian Options"}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-xl text-gray-600 font-medium p-6 bg-white rounded-lg shadow-md">
                        No menus available for your location.
                    </p>
                )}
            </main>

            <Footer className="bg-green-200 p-6 border-t border-green-300 text-center text-gray-700 font-medium" />
        </div>
    );
}

export default Page;
