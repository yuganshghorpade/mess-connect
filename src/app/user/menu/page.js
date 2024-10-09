'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../header/page";
import Footer from "@/components/ui/footer";

const DailyMenu = ({ userLocation }) => {
  const [dailyMenus, setDailyMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDailyMenus = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/dailymenu/fetching-dailymenu", {
          params: {
            longitude: userLocation.longitude,
            latitude: userLocation.latitude,
          },
        });

        if (response.data.success) {
          // Filter menus within 5 km (5000 meters)
          const filteredMenus = response.data.response.filter(menu => menu.mess.distance <= 5000);
          setDailyMenus(filteredMenus);
        } else {
          setError(response.data.message || "Failed to fetch daily menu.");
        }
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching daily menus.");
      } finally {
        setLoading(false);
      }
    };

    if (userLocation) {
      fetchDailyMenus();
    }
  }, [userLocation]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (dailyMenus.length === 0) return <p>No nearby daily menus available within 5 km.</p>;

  return (
    <div>
        <div className="flex flex-col min-h-screen">
        <Header />
      <h2>Nearby Daily Menus</h2>
      <main className="flex-grow">
    <div>
      <h2>Nearby Daily Menus</h2>
      <ul>
        {dailyMenus.map((menu, index) => (
          <li key={index}>
            <h3>{menu.mess.name}</h3>
            <p>{menu.description}</p>
            <p>{menu.menuItems.join(", ")}</p>
            <p>Distance: {menu.mess.distance.toFixed(2)} meters away</p>
          </li>
        ))}
      </ul>
    </div>
    </main>
  
    <Footer />
  </div>
    </div>
  );
};

export default DailyMenu;
