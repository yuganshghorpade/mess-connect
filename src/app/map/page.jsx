'use client'
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
// import { useState, useEffect } from 'react';

// const MessMap = () => {
//   const mapContainerStyle = {
//     height: '400px',
//     width: '100%',
//   };

//   const center = {
//     lat: 28.6139, // Default center (you can set this to your region)
//     lng: 77.209, 
//   };

//   // Sample data: Replace with your mess coordinates from the database
//   const messData = [
//     { id: 1, name: 'Mess A', lat: 28.7041, lng: 77.1025 },
//     { id: 2, name: 'Mess B', lat: 28.5355, lng: 77.391 },
//     { id: 3, name: 'Mess C', lat: 28.4089, lng: 77.3178 },
//     { id: 4, name: 'My Home', lat:21.1458004, lng: 79.0881546}
//   ];

//   return (
//     <LoadScript googleMapsApiKey="AIzaSyBMlGGiVzSM6_zqrt4-ndWNBxdCy_TEx38">
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         center={center}
//         zoom={10} // Adjust zoom level as per your requirement
//       >
//         {messData.map((mess) => (
//           <Marker key={mess.id} position={{ lat: mess.lat, lng: mess.lng }} title={mess.name} />
// //           <Marker
// //   key={mess.id}
// //   position={{ lat: mess.lat, lng: mess.lng }}
// //   title={mess.name}
// //   icon={{
// //     url: 'https://example.com/custom-marker-icon.png', // Custom icon URL
// //     scaledSize: new window.google.maps.Size(50, 50),
// //   }}
// // />
//         ))}
//       </GoogleMap>
//     </LoadScript>
//   );
// };

// export default MessMap;


// import { useEffect, useState } from "react";
// import axios from "axios";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// const MessMap = () => {
//   const [nearbyMesses, setNearbyMesses] = useState([]);
//   const [position, setPosition] = useState([0, 0]); // Default position for the map
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     // Get user's current location
//     navigator.geolocation.getCurrentPosition(
//       async (location) => {
//         const latitude = location.coords.latitude;
//         const longitude = location.coords.longitude;
//         setPosition([latitude, longitude]);

//         // Send request to the backend to fetch nearby messes
//         try {
//           const response = await axios.post("/api/your-api-route", {
//             latitude,
//             longitude,
//           });
//           if (response.data.success) {
//             setNearbyMesses(response.data.nearbyMesses);
//           } else {
//             setErrorMessage("Failed to fetch messes.");
//           }
//         } catch (error) {
//           setErrorMessage("Error occurred while fetching messes.");
//         }
//       },
//       (error) => {
//         setErrorMessage("Unable to retrieve your location.");
//       }
//     );
//   }, []);

//   return (
//     <div className="mess-map-container">
//       {errorMessage && <p>{errorMessage}</p>}
//       <MapContainer center={position} zoom={13} style={{ height: "500px", width: "100%" }}>
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />

//         {nearbyMesses.map((mess, index) => (
//           <Marker key={index} position={[mess.location.coordinates[1], mess.location.coordinates[0]]}>
//             <Popup>
//               <strong>{mess.name}</strong><br />
//               {mess.address}
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// };

// export default MessMap;

import { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";  // Import dynamic to avoid rendering on server

// Dynamically import the MapContainer to only render it on the client side
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

const MessMap = () => {
  const [nearbyMesses, setNearbyMesses] = useState([]);
  const [position, setPosition] = useState([0, 0]); // Default position for the map
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Ensure that this runs only in the browser
    if (typeof window !== "undefined") {
      // Get user's current location
      navigator.geolocation.getCurrentPosition(
        async (location) => {
          const latitude = location.coords.latitude;
          const longitude = location.coords.longitude;
          setPosition([latitude, longitude]);

          // Send request to the backend to fetch nearby messes
          try {
            const response = await axios.get("/api/mess/fetching-messes-locations", {
              latitude,
              longitude,
            });
            if (response.data.success) {
              setNearbyMesses(response.data.nearbyMesses);
            } else {
              setErrorMessage("Failed to fetch messes.");
            }
          } catch (error) {
            setErrorMessage("Error occurred while fetching messes.");
          }
        },
        (error) => {
          setErrorMessage("Unable to retrieve your location.");
        }
      );
    }
  }, []);

  return (
    <div className="mess-map-container">
      {errorMessage && <p>{errorMessage}</p>}
      <MapContainer center={position} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {nearbyMesses.map((mess, index) => (
          <Marker key={index} position={[mess.location.coordinates[1], mess.location.coordinates[0]]}>
            <Popup>
              <strong>{mess.name}</strong><br />
              {mess.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MessMap;

