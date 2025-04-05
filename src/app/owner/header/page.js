'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";  
import Link from "next/link";
import axios from 'axios'; 
import { Button } from "@/components/ui/button";
import { FaUserCircle } from "react-icons/fa"; 

export default function MyComponent() {
    const router = useRouter(); 
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const logoutUser = async () => {
        try {
            const response = await axios.post("/api/auth/logout", {}, {
                withCredentials: true
            });
            router.replace("/login"); 
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div className="w-full bg-gradient-to-r from-green-400 via-green-300 to-green-500 shadow-md">
                <div className="flex items-center justify-between h-16 px-4 md:px-10">
                    <div className="flex items-center flex-1">
                        <div className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg mr-10">
                            Taste Buddies
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="text-white focus:outline-none">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                ></path>
                            </svg>
                        </button>
                    </div>

                    {/* Conditionally render login buttons or user profile icon */}
                    <div className="hidden md:flex items-center space-x-6">
                        {isLoggedIn ? (
                            <div className="flex items-center space-x-2">
                                <FaUserCircle size={30} className="text-white" />
                                <span className="text-white text-lg">{userData?.name}</span>
                            </div>
                        ) : (
                            <>
                                <Link href="/owner">
                                    <span className="text-white text-lg hover:text-gray-200 cursor-pointer transition-colors duration-300 px-5">Home</span>
                                </Link>
                                <Link href="/owner/dailyMenu">
                                    <span className="text-white text-lg hover:text-gray-200 cursor-pointer transition-colors duration-300 px-5">Daily Menu</span>
                                </Link>
                                <Link href="/owner/anal">
                            <span className="text-white text-lg hover:text-gray-200 cursor-pointer transition-colors duration-300">My Analysis</span>
                        </Link>
                        <Link href="/owner/viewanalysis">
                            <span className="text-white text-lg hover:text-gray-200 cursor-pointer transition-colors duration-300">View Analysis</span>
                        </Link>
                                <Link href="/owner/profile">
                                    <span className="text-white text-lg hover:text-gray-200 cursor-pointer transition-colors duration-300 px-5">Profile</span>
                                </Link>
                                <Button onClick={logoutUser} className="bg-white text-gray-800 hover:bg-white-300 rounded-xl px-4 py-2">
                                    Logout
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="flex flex-col items-center space-y-4 bg-gradient-to-r from-green-400 via-green-300 to-green-500 py-4 md:hidden">
                        <Link href="/owner">
                            <span className="text-white text-lg hover:text-gray-200 cursor-pointer transition-colors duration-300">Home</span>
                        </Link>
                        <Link href="/owner/dailyMenu">
                            <span className="text-white text-lg hover:text-gray-200 cursor-pointer transition-colors duration-300">Deals</span>
                        </Link>
                        <Link href="/owner/profile">
                            <span className="text-white text-lg hover:text-gray-200 cursor-pointer transition-colors duration-300">Profile</span>
                        </Link>
                        <Link href="/owner/profile">
                            <span className="text-white text-lg hover:text-gray-200 cursor-pointer transition-colors duration-300">Profile</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
