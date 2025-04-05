import React from 'react'
import { FaUtensils, FaClock } from "react-icons/fa";
import { useState } from 'react';
import { Button } from './ui/button';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Loader2, AlertTriangle, MapPin, Phone, List, Star } from "lucide-react";
import axios from 'axios';
function Subscriptions() {
    const [mealType, setMealType] = useState(""); 
    const [duration, setDuration] = useState("");
    const [subscriptionLoading, setSubscriptionLoading] = useState(false); 
    const { toast } = useToast();
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
    
        setSubscriptionLoading(true);
    
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
          setSubscriptionLoading(false); 
        }
      }
    
  return (
    <><div>
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

      </div><div>
          </div></>
       
  )
}

export default Subscriptions