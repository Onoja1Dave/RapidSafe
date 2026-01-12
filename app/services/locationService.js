// /app/services/locationService.js

import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { db, doc, updateDoc } from "./firebase.service";

const LOCATION_TASK_NAME = "background-location-task"; // Keeping your defined task name
let currentAlertId = null;

// --- A. Define the Background Task ---
// This code runs repeatedly, even when the app is closed or minimized.
TaskManager.defineTask(
  LOCATION_TASK_NAME,
  async ({ data: { locations }, error }) => {
    if (error) {
      console.error("Background Location Task Error:", error.message);
      return;
    }
    if (!currentAlertId) {
      console.warn("Location update received, but no active alert ID.");
      return;
    }

    const latestLocation = locations[0];
    const { latitude, longitude, timestamp } = latestLocation;

    console.log(
      `[BG-LOC] Alert ${currentAlertId} - New Coords: ${latitude}, ${longitude}`
    );

    // Define the reference to the document to update
    const alertRef = doc(db, "alerts", currentAlertId);

    // Update the Firestore document with the new location
    try {
      await updateDoc(alertRef, {
        // FIX: Use a standard object instead of Admin SDK's GeoPoint
        currentLocation: { lat: latitude, lng: longitude },
        // FIX: Use a standard Date object instead of Admin SDK's Timestamp
        lastUpdated: new Date(timestamp),
        direction: latestLocation.heading || null,
      });
    } catch (e) {
      console.error("Failed to update Firestore location:", e.message);
    }
  }
);

// --- B. Main Service Functions (The rest of the file is correct) ---

/**
 * Starts the continuous background location tracking.
 * @param {string} alertId - The ID of the alert document to update.
 */
export const startBackgroundLocationService = async (alertId) => {
  currentAlertId = alertId;

  // 1. Request foreground and background location permissions
  const { status: foregroundStatus } =
    await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus !== "granted") {
    throw new Error("Foreground location permission denied.");
  }
  const { status: backgroundStatus } =
    await Location.requestBackgroundPermissionsAsync();
  if (backgroundStatus !== "granted") {
    throw new Error(
      "Background location permission denied. Tracking will fail."
    );
  }

  // 2. Stop any existing task just in case
  if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }

  // 3. Start the new background task
  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.BestForNavigation,
    timeInterval: 5000, // Update every 5 seconds (critical for emergencies)
    distanceInterval: 5, // Update every 5 meters moved
    // These settings are critical for persistent tracking on Android
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      // CRITICAL: The user sees this notification, which is required for background tracking
      notificationTitle: "Emergency Alert Active",
      notificationBody:
        "Your live location is being shared with your emergency contacts.",
      notificationColor: "#FF0000",
    },
  });

  console.log(`Background location tracking started for Alert ID: ${alertId}`);
  return true;
};

/**
 * Stops the location tracking when the alert is cancelled.
 */
export const stopBackgroundLocationService = async () => {
  if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    currentAlertId = null;
    console.log("Background location tracking stopped.");
  }
  return true;
};
