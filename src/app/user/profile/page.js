'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Header from "../header/page";
import Footer from "@/components/ui/footer";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  UserCircle, 
  Layers 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
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
                    setSubscriptions(response.data.response);
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
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="animate-pulse text-2xl text-blue-600">
                    Loading Profile...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-red-50">
                <Card className="w-96 border-red-500">
                    <CardHeader>
                        <CardTitle className="text-red-600">Error</CardTitle>
                    </CardHeader>
                    <CardContent className="text-red-500">
                        {error}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 sm:px-8 lg:px-16">
                <Tabs defaultValue="profile" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2 bg-white shadow-md rounded-xl">
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <UserCircle className="w-5 h-5" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="subscriptions" className="flex items-center gap-2">
                            <Layers className="w-5 h-5" />
                            Subscriptions
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <Card className="w-full bg-white/90 backdrop-blur-sm shadow-xl rounded-xl">
                            <CardContent className="p-8">
                                <div className="grid md:grid-cols-3 gap-8">
                                    {/* Profile Picture and Basic Info */}
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-40 h-40 rounded-full border-4 border-blue-200 shadow-lg overflow-hidden">
                                            <Image 
                                                src="/default-avatar.png" 
                                                alt="User Profile" 
                                                width={160} 
                                                height={160} 
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800 mt-4">
                                            {userData.username}
                                        </h2>
                                        <p className="text-gray-600">{userData.email}</p>
                                        <Button variant="outline" className="mt-4">
                                            Edit Profile
                                        </Button>
                                    </div>

                                    {/* Detailed Profile Information */}
                                    <div className="md:col-span-2 space-y-6">
                                        <Card className="bg-blue-50/50 border-none">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    Personal Details
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-gray-600">Contact Number</p>
                                                    <p className="font-semibold">{userData.contactNo || 'Not provided'}</p>
                                                </div>
                                                {userData.type === "mess" && (
                                                    <div>
                                                        <p className="text-gray-600">Mess Name</p>
                                                        <p className="font-semibold">{userData.messName}</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="subscriptions">
                        <Card className="w-full bg-white/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <Layers className="w-7 h-7 text-blue-600" />
                                    Your Subscriptions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {subscriptions.length > 0 ? (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {subscriptions.map((subscription) => (
                                            <Card 
                                                key={subscription._id} 
                                                className="bg-blue-50/50 hover:shadow-lg transition-all duration-300"
                                            >
                                                <CardHeader>
                                                    <CardTitle className="text-xl">
                                                        {subscription.mess 
                                                            ? subscription.mess.name 
                                                            : subscription.user.username}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Start Date</span>
                                                        <span className="font-semibold">
                                                            {new Date(subscription.startDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">End Date</span>
                                                        <span className="font-semibold">
                                                            {new Date(subscription.expiry).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <Badge 
                                                            variant={subscription.status === "Active" ? "default" : "secondary"}
                                                        >
                                                            {subscription.status}
                                                        </Badge>
                                                        <span className="text-blue-600 font-semibold">
                                                            {subscription.mealType}
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500">
                                        No subscriptions found.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
            <Footer />
        </div>
    );
}