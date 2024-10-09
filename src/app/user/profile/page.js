'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../header/page";
import Footer from "@/components/ui/footer";
import axios from "axios";
import Image from "next/image";
// Import icons from one version (solid in this case)
import { MapPinIcon, UserIcon } from '@heroicons/react/24/solid';

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]); // State for subscriptions
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user details
                const response = await axios.get(
                    "/api/user/fetching-user-details",
                    { withCredentials: true }
                );
                if (response.data.success) {
                    setUserData(response.data.response);
                } else {
                    setError(response.data.message || "Failed to load user data.");
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to load user data. Error: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchSubscription = async () => {
            try {
                const response = await axios.get(
                    "/api/subscriptions/fetch-subscriptions",
                    { withCredentials: true }
                );
                if (response.data.success) {
                    setSubscriptions(response.data.response); // Store subscription data
                } else {
                    console.error("Failed to load subscriptions:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching subscriptions:", error);
            }
        };

        fetchUserData();
        fetchSubscription();
    }, [router]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen text-lg text-gray-700">Loading...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-screen text-lg text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <main className="flex-grow">
                <div className="container mx-auto px-4 py-12 sm:px-8 lg:px-16">
                    <div className="bg-white shadow-xl rounded-lg p-8 lg:p-12">
                        {/* User Details Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 flex flex-col items-center text-center">
                            <div className="w-28 h-28 bg-gray-200 rounded-full p-3">
    <Image 
        src="/photo.png" // Path to your image
        alt="User Image" 
        className="w-full h-full object-cover rounded-full" 
        width={140} // Matches w-28 (28 * 4px = 112px)
        height={140} // Matches h-28 (28 * 4px = 112px)
    />
</div>
                                <h2 className="text-2xl font-bold text-gray-900 mt-4">
                                    {userData.username}
                                </h2>
                                <p className="text-gray-600 mt-2">{userData.email}</p>
                                <p className="text-gray-600">{userData.contactNo}</p>
                            </div>

                            <div className="lg:col-span-2 space-y-6">
                                <h3 className="text-xl font-semibold text-gray-800">Profile Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-700">
                                            <strong>Description:</strong> {userData.description}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="flex items-center text-gray-700">
                                            <MapPinIcon className="w-5 h-5 mr-2 text-green-600" />
                                            <strong>Address:</strong>{" "}
                                            {userData.address}
                                        </p>
                                    </div>
                                    {userData.type === "mess" && (
                                        <>
                                            <div>
                                                <p className="text-gray-700">
                                                    <strong>Mess Name:</strong> {userData.messName}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-700">
                                                    <strong>Address:</strong> {userData.address}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subscriptions Section */}
                    <div className="mt-12">
    <h2 className="text-3xl font-extrabold text-gray-800 mb-8">
        Subscriptions
    </h2>
    {subscriptions.length > 0 ? (
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {subscriptions.map((subscription) => (
                <li
                    key={subscription._id}
                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition-transform transform hover:scale-105"
                >
                    <p className="text-gray-900 font-semibold text-xl mb-2">
                        {subscription.mess
                            ? subscription.mess.name
                            : subscription.user.username}
                    </p>
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
