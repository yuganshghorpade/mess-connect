"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function page() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const pathname = window.location.pathname; 
                const id = pathname.split('/').pop();
                console.log('id', id)

                // Make a request to the backend, including the token in the Authorization header
                const response = await axios.get(
                    `/api/user/fetching-user-details?messid=${id}`,
                    {
                        withCredentials: true,
                    }
                );
                console.log(response);
                // Check if response data contains user information
                if (response.data.success) {
                    setUserData(response.data.response);
                } else {
                    setError(
                        response.data.message || "Failed to load user data."
                    );
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to load user data. Error: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const createSubscription = async()=>{
        try {
            const pathname = window.location.pathname; 
                const id = pathname.split('/').pop();
                console.log('id', id)
            const response = await axios.post("/api/subscriptions/create-subscription",{
                messId : id,
                mealType:"Lunch",
                durationInMilliseconds:2592000000
            },{
                withCredentials:true
            })
            console.log(response);
        } catch (error) {
            setError(error)
            console.error(error)
        }
    }
    return<>
        <div>
            <Button onClick={createSubscription}>Subscribe</Button>
        </div>
    </>;
}

export default page;
