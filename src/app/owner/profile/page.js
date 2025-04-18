"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "../header/page";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { MapPinIcon, UserCircleIcon, CalendarIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { toast } from "sonner";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const HandleExtensionRequest = ({ requestId }) => {
    const [loading, setLoading] = useState(false);

    const handleDecision = async (decision) => {
        if (!requestId) {
            toast.error("Invalid request ID");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.patch(
                `/api/subscriptions/extend-subscription-decision?requestId=${requestId}&decision=${decision}`
            );
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error in request:", error);
            toast.error("Something went wrong while handling the request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-4">
            <Button
                disabled={loading}
                onClick={() => handleDecision("Accepted")}
                className="bg-green-600 hover:bg-green-700"
            >
                Accept
            </Button>
            <Button
                disabled={loading}
                onClick={() => handleDecision("Rejected")}
                className="bg-red-600 hover:bg-red-700"
            >
                Reject
            </Button>
        </div>
    );
};

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
    const [requests, setRequests] = useState([]);
    const [downloadingSubscribers, setDownloadingSubscribers] = useState(false);
    const router = useRouter();
    const [responseMsg, setResponseMsg] = useState("");
    const [startFilterDate, setStartFilterDate] = useState("");
    const [endFilterDate, setEndFilterDate] = useState("");
    const [isFilteringDates, setIsFilteringDates] = useState(false);

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

    // Function to download active subscribers list
    // const downloadActiveSubscribers = () => {
    //     setDownloadingSubscribers(true);

    //     try {
    //         // Filter active subscriptions
    //         const activeSubscriptions = subscriptions.filter(sub => sub.status === "Active");

    //         if (activeSubscriptions.length === 0) {
    //             toast.error("No active subscribers to download");
    //             setDownloadingSubscribers(false);
    //             return;
    //         }

    //         // Create CSV content
    //         let csvContent = "User Name,Contact Number,Email,Start Date,End Date\n";

    //         activeSubscriptions.forEach(sub => {
    //             const startDate = new Date(sub.startDate).toLocaleDateString('en-US');
    //             const endDate = new Date(sub.expiry).toLocaleDateString('en-US');
    //             const email = sub.user.email || "N/A";

    //             csvContent += `${sub.user.username},${sub.user.contactNo || "N/A"},${email},${startDate},${endDate}\n`;
    //         });

    //         // Create download link
    //         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    //         const url = URL.createObjectURL(blob);
    //         const link = document.createElement("a");

    //         // Set download attributes
    //         const currentDate = new Date().toLocaleDateString('en-US', {
    //             year: 'numeric',
    //             month: 'short',
    //             day: 'numeric'
    //         }).replace(/,/g, '');

    //         link.setAttribute("href", url);
    //         link.setAttribute("download", `active-subscribers-${currentDate}.csv`);
    //         document.body.appendChild(link);

    //         // Trigger download and cleanup
    //         link.click();
    //         document.body.removeChild(link);
    //         URL.revokeObjectURL(url);

    //         toast.success("Subscribers list downloaded successfully!");
    //     } catch (error) {
    //         console.error("Error downloading subscribers:", error);
    //         toast.error("Failed to download subscribers list");
    //     } finally {
    //         setDownloadingSubscribers(false);
    //     }
    // };
    // const downloadActiveSubscribers = () => {
    //     setDownloadingSubscribers(true);

    //     const activeSubs = subscriptions.filter(sub => sub.status === "Active");

    //     const doc = new jsPDF();
    //     doc.text("Active Subscribers List", 14, 20);

    //     autoTable(doc, {
    //         head: [['Name', 'Email', 'Start Date', 'End Date']],
    //         body: activeSubs.map(sub => [
    //             sub.name,
    //             sub.email,
    //             formatDate(sub.startDate),
    //             formatDate(sub.endDate)
    //         ])
    //     });

    //     doc.save("active_subscribers.pdf");

    //     setDownloadingSubscribers(false);
    // };


    // const downloadActiveSubscribers = () => {
    //     setDownloadingSubscribers(true);

    //     try {
    //         const activeSubscriptions = subscriptions.filter(sub => sub.status === "Active");

    //         if (activeSubscriptions.length === 0) {
    //             toast.error("No active subscribers to download");
    //             setDownloadingSubscribers(false);
    //             return;
    //         }

    //         const doc = new jsPDF();
    //         doc.text("Active Subscribers List", 14, 20);

    //         // Table Header and Rows
    //         const tableHead = [["User Name", "Contact Number", "Email", "Start Date", "End Date"]];
    //         const tableBody = activeSubscriptions.map(sub => [
    //             sub.user?.username || "N/A",
    //             sub.user?.contactNo || "N/A",
    //             sub.user?.email || "N/A",
    //             new Date(sub.startDate).toLocaleDateString("en-US"),
    //             new Date(sub.expiry).toLocaleDateString("en-US")
    //         ]);

    //         autoTable(doc, {
    //             startY: 30,
    //             head: tableHead,
    //             body: tableBody,
    //         });

    //         // Filename with current date
    //         const currentDate = new Date().toLocaleDateString("en-US", {
    //             year: "numeric",
    //             month: "short",
    //             day: "numeric"
    //         }).replace(/,/g, '');

    //         doc.save(`active-subscribers-${currentDate}.pdf`);

    //         toast.success("Subscribers list downloaded successfully!");
    //     } catch (error) {
    //         console.error("Error downloading subscribers:", error);
    //         toast.error("Failed to download subscribers list");
    //     } finally {
    //         setDownloadingSubscribers(false);
    //     }
    // };
    // const downloadActiveSubscribers = () => {
    //     setDownloadingSubscribers(true);

    //     try {
    //         // Get active subscriptions
    //         let activeSubscriptions = subscriptions.filter(sub => sub.status === "Active");

    //         // Apply date filtering if enabled
    //         if (isFilteringDates && startFilterDate && endFilterDate) {
    //             const startDate = new Date(startFilterDate);
    //             const endDate = new Date(endFilterDate);

    //             // Filter subscriptions that fall within the date range
    //             // A subscription is considered within range if its period overlaps with the filter range
    //             activeSubscriptions = activeSubscriptions.filter(sub => {
    //                 const subStartDate = new Date(sub.startDate);
    //                 const subEndDate = new Date(sub.expiry);

    //                 // Check if subscription overlaps with the filter date range
    //                 return (
    //                     (subStartDate <= endDate && subEndDate >= startDate)
    //                 );
    //             });
    //         }

    //         if (activeSubscriptions.length === 0) {
    //             toast.error("No active subscribers found for the selected criteria");
    //             setDownloadingSubscribers(false);
    //             return;
    //         }

    //         const doc = new jsPDF();

    //         // Add title with date range if filtering
    //         if (isFilteringDates && startFilterDate && endFilterDate) {
    //             doc.text(`Active Subscribers List (${format(new Date(startFilterDate), "MMM d, yyyy")} - ${format(new Date(endFilterDate), "MMM d, yyyy")})`, 14, 20);
    //         } else {
    //             doc.text("Active Subscribers List", 14, 20);
    //         }

    //         // Table Header and Rows
    //         const tableHead = [["User Name", "Contact Number", "Email", "Start Date", "End Date"]];
    //         const tableBody = activeSubscriptions.map(sub => [
    //             sub.user?.username || "N/A",
    //             sub.user?.contactNo || "N/A",
    //             sub.user?.email || "N/A",
    //             new Date(sub.startDate).toLocaleDateString("en-US"),
    //             new Date(sub.expiry).toLocaleDateString("en-US")
    //         ]);

    //         autoTable(doc, {
    //             startY: 30,
    //             head: tableHead,
    //             body: tableBody,
    //         });

    //         // Filename with current date and filter info
    //         const currentDate = new Date().toLocaleDateString("en-US", {
    //             year: "numeric",
    //             month: "short",
    //             day: "numeric"
    //         }).replace(/,/g, '');

    //         let filename = `active-subscribers-${currentDate}`;
    //         if (isFilteringDates && startFilterDate && endFilterDate) {
    //             const startFormatted = format(new Date(startFilterDate), "MMM-d-yyyy");
    //             const endFormatted = format(new Date(endFilterDate), "MMM-d-yyyy");
    //             filename = `active-subscribers-${startFormatted}-to-${endFormatted}`;
    //         }

    //         doc.save(`${filename}.pdf`);
    //         toast.success("Subscribers list downloaded successfully!");
    //     } catch (error) {
    //         console.error("Error downloading subscribers:", error);
    //         toast.error("Failed to download subscribers list");
    //     } finally {
    //         setDownloadingSubscribers(false);
    //     }
    // };
    const formatDate = (dateString, formatType = "display") => {
        const date = new Date(dateString);
        
        if (formatType === "display") {
            // Format like "Jan 5, 2023"
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
        } else if (formatType === "filename") {
            // Format like "Jan-5-2023"
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            }).replace(/,\s/g, "-").replace(/\s/g, "-");
        }
        
        return dateString;
    };
    
    // Updated download function with date filtering
    const downloadActiveSubscribers = () => {
        setDownloadingSubscribers(true);
    
        try {
            // Get active subscriptions
            let activeSubscriptions = subscriptions.filter(sub => sub.status === "Active");
            
            // Apply date filtering if enabled
            if (isFilteringDates && startFilterDate && endFilterDate) {
                const startDate = new Date(startFilterDate);
                const endDate = new Date(endFilterDate);
                
                // Filter subscriptions that fall within the date range
                // A subscription is considered within range if its period overlaps with the filter range
                activeSubscriptions = activeSubscriptions.filter(sub => {
                    const subStartDate = new Date(sub.startDate);
                    const subEndDate = new Date(sub.expiry);
                    
                    // Check if subscription overlaps with the filter date range
                    return (
                        (subStartDate <= endDate && subEndDate >= startDate)
                    );
                });
            }
    
            if (activeSubscriptions.length === 0) {
                toast.error("No active subscribers found for the selected criteria");
                setDownloadingSubscribers(false);
                return;
            }
    
            const doc = new jsPDF();
            
            // Add title with date range if filtering
            if (isFilteringDates && startFilterDate && endFilterDate) {
                doc.text(`Active Subscribers List (${formatDate(startFilterDate)} - ${formatDate(endFilterDate)})`, 14, 20);
            } else {
                doc.text("Active Subscribers List", 14, 20);
            }
    
            // Table Header and Rows
            const tableHead = [["User Name", "Contact Number", "Email", "Start Date", "End Date"]];
            const tableBody = activeSubscriptions.map(sub => [
                sub.user?.username || "N/A",
                sub.user?.contactNo || "N/A",
                sub.user?.email || "N/A",
                new Date(sub.startDate).toLocaleDateString("en-US"),
                new Date(sub.expiry).toLocaleDateString("en-US")
            ]);
    
            autoTable(doc, {
                startY: 30,
                head: tableHead,
                body: tableBody,
            });
    
            // Filename with current date and filter info
            const currentDate = new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            }).replace(/,/g, '');
            
            let filename = `active-subscribers-${currentDate}`;
            if (isFilteringDates && startFilterDate && endFilterDate) {
                const startFormatted = formatDate(startFilterDate, "filename");
                const endFormatted = formatDate(endFilterDate, "filename");
                filename = `active-subscribers-${startFormatted}-to-${endFormatted}`;
            }
    
            doc.save(`${filename}.pdf`);
            toast.success("Subscribers list downloaded successfully!");
        } catch (error) {
            console.error("Error downloading subscribers:", error);
            toast.error("Failed to download subscribers list");
        } finally {
            setDownloadingSubscribers(false);
        }
    };
    


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("/api/user/fetching-user-details", {
                    withCredentials: true,
                });
                // console.log(response);
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

        const fetchRequests = async () => {
            try {
                const response = await axios.get("/api/subscriptions/fetch-extension-requests", {
                    withCredentials: true,
                });
                console.log(response);
                if (response.data.success) {
                    setRequests(response.data.extension_requests);
                } else {
                    setErrorUser(response.data.message || "Failed to load requests data.");
                }
            } catch (err) {
                console.error("Error fetching REQUEST data:", err);
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
                // console.log(response);
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
        fetchRequests();
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


                    <div className="p-6 bg-white rounded-xl shadow-lg mb-10">
                        <h2 className="text-2xl font-bold mb-4">Extension Requests</h2>
                        {!requests || requests.length === 0 ? (
                            <p className="text-gray-600">No extension requests found.</p>
                        ) : (
                            <ul className="space-y-4">
                                {requests.map((req) => (
                                    <li key={req._id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                            <div className="mb-4 md:mb-0">
                                                <p className="font-medium">Request ID: <span className="text-gray-700">{req._id}</span></p>

                                                {/* Always display date range instead of days */}
                                                <div className="space-y-1 mt-2">
                                                    <div className="flex items-center text-gray-700">
                                                        <CalendarIcon className="w-4 h-4 mr-2 text-green-500" />
                                                        <span>
                                                            From: {req.fromDate && !isNaN(new Date(req.fromDate))
                                                                ? new Date(req.fromDate).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                })
                                                                : 'Not specified'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-gray-700">
                                                        <CalendarIcon className="w-4 h-4 mr-2 text-red-500" />
                                                        <span>
                                                            To: {req.toDate && !isNaN(new Date(req.toDate))
                                                                ? new Date(req.toDate).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                })
                                                                : 'Not specified'}
                                                        </span>
                                                    </div>
                                                </div>


                                                <p className="font-medium mt-2">Status: <span className={`font-semibold ${req.status === "Pending" ? "text-yellow-600" :
                                                    req.status === "Accepted" ? "text-green-600" : "text-red-600"
                                                    }`}>{req.status}</span></p>
                                            </div>


                                            {req.status === "Pending" && (
                                                <HandleExtensionRequest requestId={req._id} />
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Subscriptions Section */}
                    <div className="mb-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                            <div className="flex items-center mb-4 md:mb-0">
                                <h2 className="text-2xl font-bold text-gray-800">Your Subscriptions</h2>
                                <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                    {subscriptions.length} {subscriptions.length === 1 ? 'subscription' : 'subscriptions'}
                                </div>
                            </div>

                            {/* Download Button - Only show for mess owners */}
                            {/*                             
                            <button
            onClick={downloadActiveSubscribers}
            disabled={
                downloadingSubscribers ||
                subscriptions.filter(sub => sub.status === "Active").length === 0
            }
            className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-all ${
                downloadingSubscribers || subscriptions.filter(sub => sub.status === "Active").length === 0
                    ? "bg-gray-400 cursor-not-allowed text-gray-200"
                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
            }`}
        >
            {downloadingSubscribers ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Downloading...
                </>
            ) : (
                <>
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF Subscribers List
                </>
            )}
        </button> */}
                            {/* <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="filterByDate"
                                        checked={isFilteringDates}
                                        onChange={() => setIsFilteringDates(!isFilteringDates)}
                                        className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="filterByDate" className="text-sm text-gray-700">
                                        Filter by date range
                                    </label>
                                </div>

                                {isFilteringDates && (
                                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                                        <div className="flex items-center">
                                            <label htmlFor="startDate" className="text-sm text-gray-700 mr-2">
                                                From:
                                            </label>
                                            <input
                                                type="date"
                                                id="startDate"
                                                value={startFilterDate}
                                                onChange={(e) => setStartFilterDate(e.target.value)}
                                                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                            />
                                        </div>

                                        <div className="flex items-center">
                                            <label htmlFor="endDate" className="text-sm text-gray-700 mr-2">
                                                To:
                                            </label>
                                            <input
                                                type="date"
                                                id="endDate"
                                                value={endFilterDate}
                                                onChange={(e) => setEndFilterDate(e.target.value)}
                                                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={downloadActiveSubscribers}
                                    disabled={
                                        downloadingSubscribers ||
                                        subscriptions.filter(sub => sub.status === "Active").length === 0 ||
                                        (isFilteringDates && (!startFilterDate || !endFilterDate))
                                    }
                                    className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-all ${downloadingSubscribers ||
                                            subscriptions.filter(sub => sub.status === "Active").length === 0 ||
                                            (isFilteringDates && (!startFilterDate || !endFilterDate))
                                            ? "bg-gray-400 cursor-not-allowed text-gray-200"
                                            : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
                                        }`}
                                >
                                    {downloadingSubscribers ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Downloading...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download PDF Subscribers List
                                        </>
                                    )}
                                </button>
                            </div> */}
                            {/* Replace your existing download button with this entire section */}
                            <div className="flex flex-col md:flex-row items-center gap-4 flex-wrap">
                                <div className="flex items-center mr-4">
                                    <input
                                        type="checkbox"
                                        id="filterByDate"
                                        checked={isFilteringDates}
                                        onChange={() => setIsFilteringDates(!isFilteringDates)}
                                        className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="filterByDate" className="text-sm text-gray-700">
                                        Filter by date
                                    </label>
                                </div>

                                {isFilteringDates && (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-700 mr-1">From:</span>
                                            <input
                                                type="date"
                                                value={startFilterDate}
                                                onChange={(e) => setStartFilterDate(e.target.value)}
                                                className="px-2 py-1 rounded border border-gray-300 text-sm"
                                            />
                                        </div>

                                        <div className="flex items-center ml-2">
                                            <span className="text-sm text-gray-700 mr-1">To:</span>
                                            <input
                                                type="date"
                                                value={endFilterDate}
                                                onChange={(e) => setEndFilterDate(e.target.value)}
                                                className="px-2 py-1 rounded border border-gray-300 text-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={downloadActiveSubscribers}
                                    disabled={
                                        downloadingSubscribers ||
                                        subscriptions.filter(sub => sub.status === "Active").length === 0 ||
                                        (isFilteringDates && (!startFilterDate || !endFilterDate))
                                    }
                                    className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-all ${downloadingSubscribers ||
                                        subscriptions.filter(sub => sub.status === "Active").length === 0 ||
                                        (isFilteringDates && (!startFilterDate || !endFilterDate))
                                        ? "bg-gray-400 cursor-not-allowed text-gray-200"
                                        : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
                                        }`}
                                >
                                    {downloadingSubscribers ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Downloading...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download PDF
                                        </>
                                    )}
                                </button>
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