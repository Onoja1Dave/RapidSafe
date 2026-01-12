// app/context/LocationContext.js
import { createContext, useContext, useState } from "react";
// Import necessary Expo modules here when you add logic (e.g., from 'expo-location')

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  // 1. Define State and Variables (e.g., location data, permissions status)
  // eslint-disable-next-line
  const [currentLocation, setCurrentLocation] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);

  // 2. Define Functions (e.g., requestLocation, startTracking)
  const requestLocationPermission = async () => {
    // This function will contain your Expo Location permission logic
    console.log("Location permission requested.");
    setPermissionStatus("granted"); // Placeholder
  };

  const value = {
    currentLocation,
    permissionStatus,
    requestLocationPermission,
    // Add other location-related data or functions here
  };

  return (
    <LocationContext.Provider value={value}>
      {/* This line is CRUCIAL: it renders the rest of your app */}
      {children}
    </LocationContext.Provider>
  );
};
