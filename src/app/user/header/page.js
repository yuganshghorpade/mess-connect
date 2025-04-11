'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FaUserCircle, FaSearch } from "react-icons/fa";

export default function Header() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();

    const logoutUser = async () => {
        setIsLoggingOut(true);
        try {
            const response = await axios.post("/api/auth/logout", {}, { withCredentials: true });
            router.replace("/login");
            console.log(response);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchTerm) {
            setIsSearching(true);
            try {
                const response = await axios.post("/api/mess/fetching-messes-locations", { searchTerm });
                if (response.data.success) {
                    const messes = response.data.messes;
                    if (messes.length > 0) {
                        router.push(`/mess/${messes[0]._id}`);
                    } else {
                        alert("No mess found with the provided name.");
                    }
                } else {
                    alert("Error: " + response.data.message);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsSearching(false);
            }
        } else {
            alert("Please enter a search term.");
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="w-full bg-gradient-to-r from-green-500 via-green-300 to-green-500 shadow-md">
            <div className="flex items-center justify-between h-16 px-4 md:px-10">
                <div className="flex items-center flex-1">
                    <div className="text-white text-3xl md:text-4xl font-extrabold drop-shadow-lg tracking-wide mr-6">
                        Mess <span className="text-yellow-300">Connect</span>
                    </div>

                    <form onSubmit={handleSearch} className="flex-1 max-w-[400px] w-full">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FaSearch className="text-green-600 opacity-70" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Search Mess"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="
                                    pl-10 
                                    pr-12 
                                    h-10 
                                    w-full 
                                    rounded-full 
                                    bg-white 
                                    border 
                                    border-green-300 
                                    focus:border-green-500 
                                    focus:ring-2 
                                    focus:ring-green-200 
                                    text-gray-700 
                                    transition-all 
                                    duration-300 
                                    ease-in-out
                                    shadow-sm
                                "
                                disabled={isSearching}
                            />
                            <button 
                                type="submit" 
                                className="
                                    absolute 
                                    right-1 
                                    top-1/2 
                                    -translate-y-1/2 
                                    bg-green-600 
                                    text-white 
                                    rounded-full 
                                    w-8 
                                    h-8 
                                    flex 
                                    items-center 
                                    justify-center 
                                    hover:bg-green-700 
                                    transition-colors 
                                    duration-300 
                                    mr-1
                                "
                                disabled={isSearching}
                            >
                                {isSearching ? (
                                    <svg 
                                        className="animate-spin h-4 w-4 text-white" 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" 
                                        viewBox="0 0 24 24"
                                    >
                                        <circle 
                                            className="opacity-25" 
                                            cx="12" 
                                            cy="12" 
                                            r="10" 
                                            stroke="currentColor" 
                                            strokeWidth="4"
                                        ></circle>
                                        <path 
                                            className="opacity-75" 
                                            fill="currentColor" 
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                ) : (
                                    <FaSearch />
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Rest of the component remains the same as previous version */}
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

                <div className="hidden md:flex items-center space-x-6">
                    {isLoggedIn && userData ? (
                        <div className="flex items-center space-x-2">
                            <FaUserCircle size={30} className="text-white" />
                            <span className="text-white text-lg">{userData.name}</span>
                        </div>
                    ) : (
                        <>
                            <Link href="/user">
                                <span className="text-white text-lg hover:text-gray-200 cursor-pointer transition-colors duration-300 px-5">Home</span>
                            </Link>
                            <Link href="/user/menu">
                                <span className="text-white text-lg hover:text-gray-200 cursor-pointer transition-colors duration-300 px-5">Menu</span>
                            </Link>
                            <Link href="/user/trades">
                                <span className="text-white text-lg hover:text-gray-200 cursor-pointer transition-colors duration-300">Trade</span>
                            </Link>
                            <Link href="/user/profile">
                                <span className="text-white text-lg hover:text-gray-200 cursor-pointer transition-colors duration-300 px-5">Profile</span>
                            </Link>
                            <Button
                                onClick={logoutUser}
                                className="bg-red-400 text-white hover:bg-white-300 rounded-xl px-4 py-2"
                                disabled={isLoggingOut}
                            >
                                {isLoggingOut ? "Logging out..." : "Logout"}
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {isMenuOpen && (
                <div className="flex flex-col items-center space-y-4 bg-gradient-to-r from-green-400 via-green-300 to-green-500 py-4 md:hidden">
                    <Link href="/user">
                        <span className="text-white text-lg hover:text-gray-200 cursor-pointer transition-colors duration-300">Home</span>
                    </Link>
                    <Link href="/user/menu">
                        <span className="text-white text-lg hover:text-gray-200 cursor-pointer transition-colors duration-300">Menu</span>
                    </Link>
                    <Link href="/user/trades">
                        <span className="text-white text-lg hover:text-gray-200 cursor-pointer transition-colors duration-300">Trade</span>
                    </Link>
                    <Link href="/user/profile">
                        <span className="text-white text-lg hover:text-gray-200 cursor-pointer transition-colors duration-300">Profile</span>
                    </Link>
                   
                    <Button
                        onClick={logoutUser}
                        className="bg-red-500 text-gray-800 hover:bg-white-300 rounded-xl px-4 py-2"
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? "Logging out..." : "Logout"}
                    </Button>
                </div>
            )}
        </div>
    );
}