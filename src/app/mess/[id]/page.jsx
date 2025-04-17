// 'use client';
// import { useToast } from "@/hooks/use-toast";
// import { Toaster } from "@/components/ui/toaster";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Loader2, AlertTriangle, MapPin, Phone, List, Star } from "lucide-react";
// import { Alert } from "@/components/ui/alert";
// import Header from "@/app/user/header/page";
// import Footer from "@/components/ui/footer";
// import Image from "next/image";
// import Subscriptions from "@/components/Subscriptions";
// import ReviewRatings from "@/components/ReviewRatings";

// function Page() {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [ratings, setRatings] = useState(null); 
//   const [ratingsError, setRatingsError] = useState(""); // **Added this line**
//   const [reviewData, setReviewData] = useState({
//     cleanliness: 0,
//     foodQuality: 0,
//     ownerBehaviour: 0,
//     deliveryPunctuality: 0,
//     variety: 0,
//     review: ""
//   });
//   const [reviewLoading, setReviewLoading] = useState(false);
 
//   const { toast } = useToast();

//   // Handle star rating clicks
//   const handleStarClick = (key, value) => {
//     setReviewData((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   // Fetch user data and mess ratings
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(""); // Reset user data error
//       setRatingsError(""); // Reset ratings error
//       try {
//         const pathname = window.location.pathname;
//         const id = pathname.split("/").pop();

//         // Fetch user data
//         const userResponse = await axios.get(`/api/user/fetching-user-details?messid=${id}`, { // Added backticks
//           withCredentials: true,
//         });
//         if (userResponse.data.success) {
//           setUserData(userResponse.data.response);
//         } else {
//           setError(userResponse.data.message || "Failed to load user data.");
//           return; // Stop further execution if user data fails
//         }
      
//         // Fetch mess ratings
//         const ratingsResponse = await axios.get(`/api/ratings/fetch-ratings?messId=${id}`); // Added backticks
//         if (ratingsResponse.data.success) {
//           const ratingsData = ratingsResponse.data.messRatings || ratingsResponse.data.response;
//           if (Array.isArray(ratingsData) && ratingsData.length > 0) {
//             setRatings(ratingsData[0]);
//           } else {
//             setRatings(null); // No ratings available
//           }
//         } else {
//           setRatings(null); // Failed to fetch ratings
//           // Optionally, you can set a ratings error if needed
//           // setRatingsError(ratingsResponse.data.message || "Failed to load mess ratings.");
//         }
          
//       } catch (err) {
//         setError("Failed to load data. Error: " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

 

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
//     setReviewLoading(true);
//     try {
//       const pathname = window.location.pathname;
//       const id = pathname.split('/').pop();

//       const response = await axios.post(`/api/ratings/review-mess?messId=${id}`, { // Added backticks
//         messId: id,
//         ...reviewData,
//       }, {
//         withCredentials: true,
//       });

//       if (response.data.success) {
//         toast({
//           title: "Review Submitted",
//           description: "Thank you for your feedback!",
//         });
//         // Optionally reset the form
//         setReviewData({
//           cleanliness: 0,
//           foodQuality: 0,
//           ownerBehaviour: 0,
//           deliveryPunctuality: 0,
//           variety: 0,
//           review: ""
//         });
//       } else {
//         throw new Error(response.data.message || "Failed to submit review.");
//       }

//     } catch (error) {
//       toast({
//         title: "Review Failed",
//         description: error.message || "An error occurred.",
//         variant: "destructive",
//       });
//     } finally {
//       setReviewLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Header */}
//       <Header />

//       {/* Main content */}
//       <div className="flex-grow container mx-auto p-6">
//         {loading ? (
//           <div className="flex justify-center items-center">
//             <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
//             <span className="ml-2 text-gray-600">Loading...</span>
//           </div>
//         ) : error ? (
//           <Alert variant="destructive" className="mt-4">
//             <AlertTriangle className="h-5 w-5" />
//             <span className="ml-2">{error}</span>
//             <button
//               className="ml-4 text-blue-600 underline"
//               onClick={() => window.location.reload()}
//             >
//               Retry
//             </button>
//           </Alert>
//         ) : userData ? (
//           <>
//             <div className="flex flex-col md:flex-row gap-4 mt-4">
//               {/* Image Section */}
//               <div className="md:w-1/2 flex justify-center items-center h-full">
//                 <Image
//                   src="/food2.jpeg"
//                   alt="mess image"
//                   height={500}
//                   width={500}
//                   className="object-cover rounded-md w-full h-full"
//                 />
//               </div>

//               {/* Info and Forms Section */}
//               <div className="md:w-1/2 flex flex-col justify-between h-full">
//                 <div>
//                   {/* User Info Card */}
//                   <Card className="shadow-lg">
//                     <CardHeader>
//                       <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
//                         <List className="w-6 h-6 mr-2 text-blue-600" />
//                         {userData.name}
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         <p>
//                           <strong>Description:</strong> {userData.description}
//                         </p>
//                         <p className="flex items-center">
//                           <MapPin className="w-5 h-5 mr-2 text-green-600" />
//                           <strong>Address:</strong> {userData.address}
//                         </p>
//                         <p className="flex items-center">
//                           <Phone className="w-5 h-5 mr-2 text-red-600" />
//                           <strong>Contact:</strong> {userData.contactNo}
//                         </p>
//                         {/* <p className="flex items-center">
//                           <List className="w-5 h-5 mr-2 text-purple-600" />
//                           <strong>Menu Items:</strong>{" "}
//                           {Array.isArray(userData.menuItems)
//                             ? userData.menuItems.join(", ")
//                             : " No menu items available"}
//                         </p> */}
//                       </div>
//                     </CardContent>
//                   </Card>

//                   {/* Subscription */}
//                   <Subscriptions/>
                 

//                    <ReviewRatings/>
//                 </div>
//               </div>
//             </div>
//           </>
//         ) : (
//           <p>No user data available</p>
//         )}
//       </div>

//       {/* Toaster for notifications */}
//       <Toaster />

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }

// export default Page;

'use client';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, MapPin, Phone, List, Download, FileText } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import Header from "@/app/user/header/page";
import Footer from "@/components/ui/footer";
import Image from "next/image";
import ReviewRatings from "@/components/ReviewRatings";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Razorpay script loader
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Receipt Component
const Receipt = ({ receiptData, onClose }) => {
  const receiptRef = useRef(null);

  const downloadAsPDF = () => {
    const receipt = receiptRef.current;
    
    html2canvas(receipt).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${receiptData.messName}-receipt.pdf`);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Subscription Receipt</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div ref={receiptRef} className="border border-gray-300 rounded-lg p-6 mb-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Mess Subscription Receipt</h3>
            <div className="text-sm text-gray-500">
              Receipt #: {receiptData.paymentId.slice(-8)}
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Mess Details</h4>
            <p><span className="font-medium">Name:</span> {receiptData.messName}</p>
            <p><span className="font-medium">Address:</span> {receiptData.messAddress}</p>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Subscription Details</h4>
            <p><span className="font-medium">Meal Type:</span> {receiptData.mealType}</p>
            <p><span className="font-medium">Duration:</span> {receiptData.duration}</p>
            <p><span className="font-medium">Start Date:</span> {receiptData.startDate}</p>
            <p><span className="font-medium">End Date:</span> {receiptData.endDate}</p>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Payment Details</h4>
            <p><span className="font-medium">Payment ID:</span> {receiptData.paymentId}</p>
            <p><span className="font-medium">Amount Paid:</span> ₹{receiptData.amountPaid}</p>
            <p><span className="font-medium">Payment Date:</span> {receiptData.paymentDate}</p>
          </div>
          
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>Thank you for your subscription!</p>
          </div>
        </div>
        
        <button 
          onClick={downloadAsPDF} 
          className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Receipt as PDF
        </button>
      </div>
    </div>
  );
};

function Page() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState("monthly");
  const [mealType, setMealType] = useState("Lunch");
  const [error, setError] = useState("");
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
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const pathname = window.location.pathname;
        const id = pathname.split("/").pop();

        const userResponse = await axios.get(`/api/user/fetching-user-details?messid=${id}`, {
          withCredentials: true,
        });
        if (userResponse.data.success) {
          setUserData(userResponse.data.response);
        } else {
          setError(userResponse.data.message || "Failed to load user data.");
          return;
        }

        const ratingsResponse = await axios.get(`/api/ratings/fetch-ratings?messId=${id}`);
        if (ratingsResponse.data.success) {
          const ratingsData = ratingsResponse.data.messRatings || ratingsResponse.data.response;
          setRatings(Array.isArray(ratingsData) && ratingsData.length > 0 ? ratingsData[0] : null);
        }

      } catch (err) {
        setError("Failed to load data. Error: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateDates = (durationType) => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    
    switch(durationType) {
      case "monthly":
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case "quarterly":
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case "yearly":
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      default:
        endDate.setMonth(endDate.getMonth() + 1);
    }
    
    return {
      startDate: startDate.toLocaleDateString(),
      endDate: endDate.toLocaleDateString()
    };
  };

  const generateReceiptData = (paymentInfo, amount) => {
    const { startDate, endDate } = calculateDates(duration);
    
    return {
      messName: userData.name,
      messAddress: userData.address,
      mealType: mealType,
      duration: duration === "monthly" ? "Monthly" : 
               duration === "quarterly" ? "Quarterly" : "Yearly",
      startDate: startDate,
      endDate: endDate,
      paymentId: paymentInfo.razorpay_payment_id,
      amountPaid: (amount / 100).toFixed(2),
      paymentDate: new Date().toLocaleDateString()
    };
  };

  const handleSubscribe = async () => {
    if (!duration || !mealType) {
      toast({
        title: "Missing Fields",
        description: "Please select both meal type and subscription duration.",
        variant: "destructive",
      });
      return;
    }

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast({
          title: "Error",
          description: "Failed to load Razorpay SDK.",
          variant: "destructive",
        });
        return;
      }

      const pathname = window.location.pathname;
      const messId = pathname.split('/').pop();

      const response = await axios.post(`/api/payment`, { duration, mealType }, {
        withCredentials: true,
      });

      if (response.status === 200) {
        const { amount, id: order_id } = response.data;

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: amount.toString(),
          currency: "INR",
          name: "Mess Subscription",
          description: "Subscribe to the mess",
          order_id,

          handler: async function (responseData) {
            try {
              const subscriptionResponse = await axios.post(`/api/subscriptions/create-subscription`, {
                messId,
                mealType,
                durationInMilliseconds: duration === "monthly" ? 2592000000 :
                  duration === "quarterly" ? 7776000000 : 31536000000,
                paymentData: responseData,
              });

              if (subscriptionResponse.data.success) {
                toast({
                  title: "Subscription Successful",
                  description: "You have successfully subscribed to the mess!",
                });
                
                // Generate receipt data and show receipt
                const receiptInfo = generateReceiptData(responseData, amount);
                setReceiptData(receiptInfo);
                setShowReceipt(true);
                
              } else {
                toast({
                  title: "Subscription Failed",
                  description: subscriptionResponse.data.message || "There was an issue.",
                  variant: "destructive",
                });
              }
            } catch (error) {
              toast({
                title: "Subscription Error",
                description: error.message || "Failed to complete the subscription.",
                variant: "destructive",
              });
            }
          },

          prefill: {
            name: userData?.name,
            email: userData?.email,
            contact: userData?.contactNo,
          },

          theme: {
            color: "#0f172a",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast({
          title: "Error",
          description: "Failed to initiate the payment process.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the subscription.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
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
              <div className="md:w-1/2 flex justify-center items-center h-full">
                <Image
                  src="/food2.jpeg"
                  alt="mess image"
                  height={500}
                  width={500}
                  className="object-cover rounded-md w-full h-full"
                />
              </div>

              <div className="md:w-1/2 flex flex-col justify-between h-full">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                      <List className="w-6 h-6 mr-2 text-blue-600" />
                      {userData.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Description:</strong> {userData.description}</p>
                    <p className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-green-600" />
                      <strong>Address:</strong> {userData.address}
                    </p>
                    <p className="flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-red-600" />
                      <strong>Contact:</strong> {userData.contactNo}
                    </p>
                  </CardContent>
                </Card>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Meal Type:
                  </label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Subscription Duration:
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <button
                  onClick={handleSubscribe}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4"
                >
                  Subscribe Now
                </button>

                {/* Receipt View Button (for testing) */}
                {/*
                <button
                  onClick={() => {
                    const testReceiptData = {
                      messName: userData.name,
                      messAddress: userData.address,
                      mealType: mealType,
                      duration: "Monthly",
                      startDate: new Date().toLocaleDateString(),
                      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString(),
                      paymentId: "pay_" + Math.random().toString(36).substr(2, 9),
                      amountPaid: "1200.00",
                      paymentDate: new Date().toLocaleDateString()
                    };
                    setReceiptData(testReceiptData);
                    setShowReceipt(true);
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md mt-2"
                >
                  View Sample Receipt (Test)
                </button>
                */}

                <ReviewRatings />
              </div>
            </div>
          </>
        ) : (
          <p>No user data available</p>
        )}
      </div>

      {/* Receipt Modal */}
      {showReceipt && receiptData && (
        <Receipt 
          receiptData={receiptData}
          onClose={() => setShowReceipt(false)}
        />
      )}

      {/* View Receipt History Button */}
      {userData && (
        <div className="container mx-auto px-6 mb-6">
          <button
            onClick={() => {
              toast({
                title: "Receipt History",
                description: "This feature will allow you to view all your past receipts.",
              });
            }}
            className="flex items-center justify-center bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Receipt History
          </button>
        </div>
      )}

      <Toaster />
      <Footer />
    </div>
  );
}

export default Page;