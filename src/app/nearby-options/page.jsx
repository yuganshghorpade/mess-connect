'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function page() {
  const [fetchedMenus, setFetchedMenus] = useState([])
  const [location, setLocation] = useState({})
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchlocation = async()=>{
      const handleSuccess = async (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        const response = await axios.get(`/api/dailymenu/fetching-dailymenu?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`,{
          withCredentials:true
        })
        console.log(response);
        setFetchedMenus(response.data.dailyMenus)
    };
  
      const handleError = (error) => {
        setError(error.message);
      };
  
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
          enableHighAccuracy: true, // Request higher accuracy
          timeout: 5000, // Set a timeout (5 seconds in this case)
          maximumAge: 0 // Do not use a cached position
        });
      } else {
        setError("Geolocation is not supported by this browser.");
      }
  }
  fetchlocation()
  }, [])
  

  return (
    <>
    <div></div>
    </>
  )
}

export default page