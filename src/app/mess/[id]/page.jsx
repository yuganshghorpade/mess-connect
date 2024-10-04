'use client'
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, MapPin, Phone, List, Star } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import Header from "@/app/user/header/page";
import Footer from "@/components/ui/footer";
import Image from "next/image";


function Page() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mealType, setMealType] = useState(""); 
  const [duration, setDuration] = useState("");
  const [ratings, setRatings] = useState(null); 
  const [reviewData, setReviewData] = useState({
    cleanliness: 0,
    foodQuality: 0,
    ownerBehaviour: 0,
    deliveryPunctuality: 0,
    variety: 0,
    review: ""
  });
  const { toast } = useToast();

  // Fetch user data and mess ratings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pathname = window.location.pathname;
        const id = pathname.split("/").pop();

        // Fetch user data
        const userResponse = await axios.get(`/api/user/fetching-user-details?messid=${id}`, {
          withCredentials: true,
        });
        if (userResponse.data.success) {
          setUserData(userResponse.data.response);
        } else {
          setError(userResponse.data.message || "Failed to load user data.");
        }

        // Fetch mess ratings
        const ratingsResponse = await axios.get(`/api/ratings/fetch-ratings?messId=${id}`);
        console.log(ratingsResponse)
        if (ratingsResponse.data.success) {
          setRatings(ratingsResponse.data.messRatings[0]);
        } else {
          setError("Failed to load mess ratings.");
        }
      } catch (err) {
        setError("Failed to load data. Error: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const createSubscription = async (e) => {
    e.preventDefault();
    if (!mealType || !duration) {
      toast({
        title: "Missing Fields",
        description: "Please select both meal type and subscription duration.",
        variant: "destructive",
      });
      return;
    }

    try {
      const pathname = window.location.pathname;
      const id = pathname.split('/').pop();

      const response = await axios.post("/api/subscriptions/create-subscription", {
        messId: id,
        mealType,
        durationInMilliseconds: duration === "Monthly" ? 2592000000 : duration === "Quarterly" ? 7776000000 : 31536000000
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        toast({
          title: "Subscription Successful",
          description: "You have successfully subscribed!",
        });
      } else if (response.data.message === "Already subscribed") {
        toast({
          title: "Already Subscribed",
          description: "You are already subscribed to this meal plan.",
        });
      } else {
        throw new Error(response.data.message || "Failed to subscribe.");
      }

    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const pathname = window.location.pathname;
      const id = pathname.split('/').pop();

      const response = await axios.post("/api/ratings/review-mess", {
        messId: id,
        ...reviewData,
      }, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast({
          title: "Review Submitted",
          description: "Thank you for your feedback!",
        });
      } else {
        throw new Error(response.data.message || "Failed to submit review.");
      }

    } catch (error) {
      toast({
        title: "Review Failed",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleStarClick = (key, value) => {
    setReviewData({ ...reviewData, [key]: value });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="flex-grow container mx-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-5 w-5" />
            <span className="ml-2">{error}</span>
          </Alert>
        ) : userData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="w-full flex justify-center items-center">
                <Image
                  src={userData.image || "/default-image.jpg"}
                  alt={userData.name}
                  width={600}
                  height={500}
                  className="object-cover rounded-lg shadow-xl"
                />
              </div>

              <div className="flex flex-col justify-center space-y-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                      <List className="w-6 h-6 mr-2 text-blue-600" />
                      {userData.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p><strong>Description:</strong> {userData.description}</p>
                      <p className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-green-600" />
                        <strong>Address:</strong> 
                        {userData.location?.coordinates ? `Lat: ${userData.location.coordinates[0]}, Long: ${userData.location.coordinates[1]}` : "Location not available"}
                      </p>
                      <p className="flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-red-600" />
                        <strong>Contact:</strong> {userData.contactNo}
                      </p>
                      <p className="flex items-center">
                        <List className="w-5 h-5 mr-2 text-purple-600" />
                        <strong>Menu Items:</strong> 
                        {Array.isArray(userData.menuItems) ? userData.menuItems.join(", ") : "No menu items available"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Display Mess Ratings */}
                {ratings ? (
                  <Card className="mt-6 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-gray-800">Mess Ratings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p><strong>Cleanliness:</strong> {ratings.avgCleanliness.toFixed(1)} / 5</p>
                      <p><strong>Food Quality:</strong> {ratings.avgFoodQuality.toFixed(1)} / 5</p>
                      <p><strong>Owner Behaviour:</strong> {ratings.avgOwnerBehaviour.toFixed(1)} / 5</p>
                      <p><strong>Delivery Punctuality:</strong> {ratings.avgDeliveryPunctuality.toFixed(1)} / 5</p>
                      <p><strong>Variety:</strong> {ratings.avgVariety.toFixed(1)} / 5</p>
                      <p><strong>Overall Rating:</strong> {ratings.overallAverage.toFixed(1)} / 5</p>
                    </CardContent>
                  </Card>
                ) : (
                  <p>No ratings available</p>
                )}
              </div>
            </div>

            {/* Review Section */}
            <div className="mt-8 px-10">
              <h2 className="text-xl font-bold">Submit Your Review</h2>
              <form className="space-y-6 mt-4" onSubmit={handleReviewSubmit}>
                {["cleanliness", "foodQuality", "ownerBehaviour", "deliveryPunctuality", "variety"].map((key) => (
                  <div key={key}>
                    <label className="block text-gray-700 font-semibold">{key.replace(/([A-Z])/g, ' $1')}:</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          className={`w-6 h-6 cursor-pointer ${reviewData[key] >= value ? "text-yellow-500" : "text-gray-400"}`}
                          onClick={() => handleStarClick(key, value)}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                <div>
                  <label htmlFor="review" className="block text-gray-700 font-semibold">Your Review:</label>
                  <textarea
                    id="review"
                    rows="4"
                    onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
                    className="w-full p-3 border rounded-lg shadow-sm"
                  />
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600">Submit Review</button>
              </form>
            </div>
          </>
        ) : null}
      </div>

      {/* Footer */}
      <Footer />
      <Toaster />
    </div>
  );
}

export default Page;
