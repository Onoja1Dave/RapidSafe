// /app/services/alertService.js
import * as Location from "expo-location"; // New import to get current location
import { functions, httpsCallable } from "./firebase.service";
import { startBackgroundLocationService } from "./locationService";

/**
 * 1. Calls the deployed Firebase Cloud Function.
 */
const callFirebaseCloudFunction = async (
  userId,
  triggerMethod,
  contacts,
  initialLocation
) => {
  const initiateSOSFunction = httpsCallable(functions, "initiateSOS");

  // We send the data payload to the backend
  const response = await initiateSOSFunction({
    userId,
    triggerMethod,
    contacts,
    initialLocation: {
      // Simplify location object for transmission
      lat: initialLocation.coords.latitude,
      lng: initialLocation.coords.longitude,
    },
  });

  return response.data; // Returns { success, message, alertId }
};

/**
 * 2. Main SOS Trigger Function
 */
export const initiateSOS = async (userId, triggerMethod, contacts) => {
  // --- Step 1: Get Initial Location ---
  let initialLocation;
  try {
    // Use high accuracy for the initial critical fix
    initialLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
  } catch (e) {
    console.error("Failed to get initial location:", e.message);
    // CRITICAL DECISION: Continue the alert even if location fails, as SMS is paramount
    initialLocation = { coords: { latitude: 0, longitude: 0 } }; // Default to 0,0 if failed
  }

  // --- Step 2: Call Backend and Get Alert ID ---
  let result;
  try {
    result = await callFirebaseCloudFunction(
      userId,
      triggerMethod,
      contacts,
      initialLocation
    );
  } catch (error) {
    console.error("Backend alert function failed:", error.message);
    return { success: false, error: "Backend communication failed." };
  }

  // --- Step 3: Start Continuous Tracking ---
  if (result.success && result.alertId) {
    try {
      // Start the background service using the ID of the Firestore document
      await startBackgroundLocationService(result.alertId);
      console.log(
        `Alert fully active. Tracking updates started for ${result.alertId}`
      );
    } catch (e) {
      console.error("Failed to start background tracking:", e.message);
      // SMS was sent, so we still return success, but log the tracking failure
    }
  }

  return result;
};
