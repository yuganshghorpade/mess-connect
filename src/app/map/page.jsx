'use client'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

const MessMap = () => {
  const mapContainerStyle = {
    height: '400px',
    width: '100%',
  };

  const center = {
    lat: 28.6139, // Default center (you can set this to your region)
    lng: 77.209, 
  };

  // Sample data: Replace with your mess coordinates from the database
  const messData = [
    { id: 1, name: 'Mess A', lat: 28.7041, lng: 77.1025 },
    { id: 2, name: 'Mess B', lat: 28.5355, lng: 77.391 },
    { id: 3, name: 'Mess C', lat: 28.4089, lng: 77.3178 },
    { id: 4, name: 'My Home', lat:21.1458004, lng: 79.0881546}
  ];

  return (
    <LoadScript googleMapsApiKey="AIzaSyBMlGGiVzSM6_zqrt4-ndWNBxdCy_TEx38">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10} // Adjust zoom level as per your requirement
      >
        {messData.map((mess) => (
          <Marker key={mess.id} position={{ lat: mess.lat, lng: mess.lng }} title={mess.name} />
//           <Marker
//   key={mess.id}
//   position={{ lat: mess.lat, lng: mess.lng }}
//   title={mess.name}
//   icon={{
//     url: 'https://example.com/custom-marker-icon.png', // Custom icon URL
//     scaledSize: new window.google.maps.Size(50, 50),
//   }}
// />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MessMap;
