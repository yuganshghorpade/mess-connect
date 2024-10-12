'use client';
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
import { FaUtensils, FaClock } from "react-icons/fa"; // FontAwesome icons
import { Button } from "@/components/ui/button";

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
  const [reviewLoading, setReviewLoading] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false); // Added subscription loading state
  const { toast } = useToast();

  // Handle star rating clicks
  const handleStarClick = (key, value) => {
    setReviewData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Fetch user data and mess ratings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pathname = window.location.pathname;
        const id = pathname.split("/").pop();

        // Fetch user data
        const userResponse = await axios.get(`/api/user/fetching-user-details?messid=${id}`, { // Added backticks
          withCredentials: true,
        });
        if (userResponse.data.success) {
          setUserData(userResponse.data.response);
        } else {
          setError(userResponse.data.message || "Failed to load user data.");
        }
      
        // Fetch mess ratings
        const ratingsResponse = await axios.get(`/api/ratings/fetch-ratings?messId=${id}`); // Added backticks
        if (ratingsResponse.data.success) {
          const ratingsData = ratingsResponse.data.messRatings || ratingsResponse.data.response;
          if (Array.isArray(ratingsData) && ratingsData.length > 0) {
            setRatings(ratingsData[0]);
          } else {
            setError("No ratings available for this mess.");
          }
        } else {
          setError(ratingsResponse.data.message || "Failed to load mess ratings.");
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

    setSubscriptionLoading(true); // Start loading

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
    } finally {
      setSubscriptionLoading(false); // End loading
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      const pathname = window.location.pathname;
      const id = pathname.split('/').pop();

      const response = await axios.post(`/api/ratings/review-mess?messId=${id}`, { // Added backticks
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
        // Optionally reset the form
        setReviewData({
          cleanliness: 0,
          foodQuality: 0,
          ownerBehaviour: 0,
          deliveryPunctuality: 0,
          variety: 0,
          review: ""
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
    } finally {
      setReviewLoading(false);
    }
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
            <button
              className="ml-4 text-blue-600 underline"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </Alert>
        ) : userData ? (
          <>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              {/* Image Section */}
              <div className="md:w-1/2 flex justify-center items-center h-full">
                <Image
                  src="/food2.jpeg"
                  alt="mess image"
                  height={500}
                  width={500}
                  className="object-cover rounded-md w-full h-full"
                />
              </div>

              {/* Info and Forms Section */}
              <div className="md:w-1/2 flex flex-col justify-between h-full">
                <div>
                  {/* User Info Card */}
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                        <List className="w-6 h-6 mr-2 text-blue-600" />
                        {userData.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p>
                          <strong>Description:</strong> {userData.description}
                        </p>
                        <p className="flex items-center">
                          <MapPin className="w-5 h-5 mr-2 text-green-600" />
                          <strong>Address:</strong> {userData.address}
                        </p>
                        <p className="flex items-center">
                          <Phone className="w-5 h-5 mr-2 text-red-600" />
                          <strong>Contact:</strong> {userData.contactNo}
                        </p>
                        {/* <p className="flex items-center">
                          <List className="w-5 h-5 mr-2 text-purple-600" />
                          <strong>Menu Items:</strong>{" "}
                          {Array.isArray(userData.menuItems)
                            ? userData.menuItems.join(", ")
                            : " No menu items available"}
                        </p> */}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Subscription */}
                  <form
                    onSubmit={createSubscription}
                    className="mt-10 flex flex-col items-center bg-gradient-to-br from-white to-green-50 p-8 rounded-xl shadow-lg mb-8 border border-gray-200 transition-shadow duration-300 ease-in-out"
                  >
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-wide">
                      Subscribe to Meal Plan
                    </h2>
                    <div className="flex flex-col md:flex-row w-full space-y-6 md:space-y-0 md:space-x-8">
                      <div className="w-full md:w-1/2">
                        <label
                          htmlFor="mealType"
                          className="block text-sm font-bold text-gray-700 tracking-wide"
                        >
                          <FaUtensils className="inline-block mr-2" /> Meal Type
                        </label>
                        <select
                          id="mealType"
                          className="mt-3 block w-full rounded-lg border border-gray-300 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm transition-all duration-300 ease-in-out"
                          value={mealType}
                          onChange={(e) => setMealType(e.target.value)}
                          required
                        >
                          <option value="">Select Meal Type</option>
                          <option value="Lunch">Lunch</option>
                          <option value="Dinner">Dinner</option>
                        </select>
                      </div>
                      <div className="w-full md:w-1/2">
                        <label
                          htmlFor="duration"
                          className="block text-sm font-bold text-gray-700 tracking-wide"
                        >
                          <FaClock className="inline-block mr-2" /> Duration
                        </label>
                        <select
                          id="duration"
                          className="mt-3 block w-full rounded-lg border border-gray-300 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm transition-all duration-300 ease-in-out"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          required
                        >
                          <option value="">Select Duration</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Quarterly">Quarterly</option>
                          <option value="Yearly">Yearly</option>
                        </select>
                      </div>
                    </div>

                    {/* Subscribe Button with Loading Indicator */}
                    <Button
                      type="submit"
                      className="mt-10 w-full md:w-auto px-6 py-3 text-lg font-semibold flex items-center justify-center"
                      disabled={subscriptionLoading}
                    >
                      {subscriptionLoading ? (
                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                      ) : (
                        <FaUtensils className="mr-2" />
                      )}
                      {subscriptionLoading ? "Subscribing..." : "Subscribe"}
                    </Button>
                  </form>

                </div>

                <div>
                  {/* Review Form */}
                  <form onSubmit={handleReviewSubmit} className="mt-10">
                    <h2 className="text-xl font-bold mb-4">Submit a Review</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {[
                        "cleanliness",
                        "foodQuality",
                        "ownerBehaviour",
                        "deliveryPunctuality",
                        "variety",
                      ].map((key, index) => (
                        <div key={index}>
                          <label
                            htmlFor={key}
                            className="block text-sm font-medium text-gray-700 capitalize"
                          >
                            {key.replace(/([A-Z])/g, " $1")}
                          </label>
                          <div className="flex items-center space-x-1 mt-2">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <Star
                                key={value}
                                onClick={() => handleStarClick(key, value)}
                                className={`w-6 h-6 cursor-pointer ${
                                  reviewData[key] >= value
                                    ? "text-yellow-500"
                                    : "text-gray-400"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <label
                        htmlFor="review"
                        className="block text-sm font-medium text-black"
                      >
                        Review
                      </label>
                      <textarea
                        id="review"
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-900 shadow-sm p-2"
                        value={reviewData.review}
                        onChange={(e) =>
                          setReviewData({ ...reviewData, review: e.target.value })
                        }
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={reviewLoading}
                      className="mt-4 flex items-center justify-center"
                    >
                      {reviewLoading ? (
                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                      ) : (
                        ""
                      )}
                      {reviewLoading ? "Submitting..." : "Submit Review"}
                    </Button>
                  </form>

                  {/* Ratings */}
                  {ratings ? (
                    <Card className="mt-6 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-800">
                          Mess Ratings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p>
                          <strong>Cleanliness:</strong>{" "}
                          {ratings.avgCleanliness.toFixed(1)} / 5
                        </p>
                        <p>
                          <strong>Food Quality:</strong>{" "}
                          {ratings.avgFoodQuality.toFixed(1)} / 5
                        </p>
                        <p>
                          <strong>Owner Behaviour:</strong>{" "}
                          {ratings.avgOwnerBehaviour.toFixed(1)} / 5
                        </p>
                        <p>
                          <strong>Delivery Punctuality:</strong>{" "}
                          {ratings.avgDeliveryPunctuality.toFixed(1)} / 5
                        </p>
                        <p>
                          <strong>Variety:</strong>{" "}
                          {ratings.avgVariety.toFixed(1)} / 5
                        </p>
                        <p>
                          <strong>Overall Rating:</strong>{" "}
                          {ratings.overallAverage.toFixed(1)} / 5
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <p className="mt-4">No ratings available</p>
                  )}

                </div>
              </div>
            </div>
          </>
        ) : (
          <p>No user data available</p>
        )}
      </div>

      {/* Toaster for notifications */}
      <Toaster />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Page;
