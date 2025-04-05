import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Star } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
function ReviewRatings() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userData, setUserData] = useState(null);
    const { toast } = useToast();
    
      const [ratings, setRatings] = useState(null); 
      const [ratingsError, setRatingsError] = useState(""); 
      const [reviewData, setReviewData] = useState({
        cleanliness: 0,
        foodQuality: 0,
        ownerBehaviour: 0,
        deliveryPunctuality: 0,
        variety: 0,
        review: ""
      });
      const [reviewLoading, setReviewLoading] = useState(false);
      const [subscriptionLoading, setSubscriptionLoading] = useState(false); 
    const handleStarClick = (key, value) => {
        setReviewData((prev) => ({
          ...prev,
          [key]: value,
        }));
      };
    
    
      useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          setError(""); 
          setRatingsError(""); 
          try {
            const pathname = window.location.pathname;
            const id = pathname.split("/").pop();
    
           
            const userResponse = await axios.get(`/api/user/fetching-user-details?messid=${id}`, { // Added backticks
              withCredentials: true,
            });
            if (userResponse.data.success) {
              setUserData(userResponse.data.response);
            } else {
              setError(userResponse.data.message || "Failed to load user data.");
              return; 
            }
          
            
            const ratingsResponse = await axios.get(`/api/ratings/fetch-ratings?messId=${id}`); // Added backticks
            if (ratingsResponse.data.success) {
              const ratingsData = ratingsResponse.data.messRatings || ratingsResponse.data.response;
              if (Array.isArray(ratingsData) && ratingsData.length > 0) {
                setRatings(ratingsData[0]);
              } else {
                setRatings(null); 
              }
            } else {
              setRatings(null); 
             
            }
              
          } catch (err) {
            setError("Failed to load data. Error: " + err.message);
          } finally {
            setLoading(false);
          }
        };
        
        fetchData();
      }, []);
      
    
     
    
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
    <div>
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
                    <p className="mt-4">No ratings available for this mess.</p>
                  )}
    </div>
  )
}

export default ReviewRatings