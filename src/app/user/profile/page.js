'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; 
import Header from "../header/page";
import Footer from "@/components/ui/footer";


export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // const token = getCookie('accessToken');

        // Make a request to the backend, including the token in the Authorization header
        const response = await axios.get("/api/user/fetching-user-details",{
          withCredentials:true
        })
        console.log(response)
        // Check if response data contains user information
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

    fetchUserData();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
    <Header />
    <main className="flex-grow">
      <div className="container mx-auto p-6 sm:p-8 lg:p-12">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Profile Page</h1>
        {userData ? (
          <div className="bg-white shadow-lg rounded-lg p-8 sm:p-10 lg:p-12">
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
              <h2 className="text-2xl font-semibold text-gray-900">{userData.username}</h2>
            </div>
            <div className="text-gray-700 space-y-3">
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Contact:</strong> {userData.contactNo}</p>
              {userData.type === "mess" && (
                <>
                  <p><strong>Mess Name:</strong> {userData.messName}</p>
                  <p><strong>Address:</strong> {userData.address}</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <p className="text-red-500 text-lg">No user data available</p>
        )}
      </div>
    </main>
    <Footer />
  </div>
  
  );
}
