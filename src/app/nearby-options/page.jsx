'use client'
// import { useState, useEffect } from "react";

// const LocationComponent = () => {
//   const [location, setLocation] = useState({ latitude: null, longitude: null });
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//           console.log("latitute",position.coords.latitude);
//           console.log("longitute",position.coords.longitude);
//         },
//         (error) => {
//           setError(error.message);
//         }
//       );
//     } else {
//       setError("Geolocation is not supported by this browser.");
//     }
//   }, []);

//   return (
//     <div>
//       {error ? (
//         <p>Error: {error}</p>
//       ) : (
//         <p>
//           Latitude: {location.latitude}, Longitude: {location.longitude}
//         </p>
//       )}
//     </div>
//   );
// };

// export default LocationComponent;
import { useState, useEffect } from "react";

const LocationComponent = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [accuracy, setAccuracy] = useState(null); // Added to show accuracy

  useEffect(() => {
    const handleSuccess = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setAccuracy(position.coords.accuracy); // Update accuracy
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
  }, []);

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <p>
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </p>
          {accuracy && <p>Accuracy: {accuracy} meters</p>}
        </div>
      )}
    </div>
  );
};

export default LocationComponent;
