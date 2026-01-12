import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { LocationProvider } from "../context/LocationContext";
import { SettingsProvider, useSettings } from "../context/SettingsContext";

// --- The Navigation Guard Component (Handles all logic) ---
function RootNavigationGuard() {
  const { user, isLoading } = useAuth();
  const { settings, isSettingsLoading } = useSettings();
  const segments = useSegments();
  const router = useRouter(); // State to ensure we only try to redirect after the initial render cycle completes

  const [canRedirect, setCanRedirect] = useState(false);

  const isAuthGroup = segments[0] === "(auth)";
  const isReady = !isLoading && !isSettingsLoading && canRedirect;

  useEffect(() => {
    // 1. Wait until all context data is fully loaded
    if (isLoading || isSettingsLoading) {
      return;
    } // 2. Enable redirection logic once loading is complete
    if (!canRedirect) {
      setCanRedirect(true);
      return;
    } // 🛑 CRITICAL FIX: Add a small delay to prevent the race condition
    const timer = setTimeout(() => {
      // --- CONSOLIDATED ROUTING LOGIC ---
      if (!user) {
        // Scenario 1: User is NOT Logged In (First launch or signed out)
        if (!isAuthGroup) {
          // If not logged in AND trying to access protected area
          router.replace("/login");
        }
      } else {
        // Scenario 2: User IS Logged In
        const pinsSet = settings?.isPinSet;

        if (!pinsSet) {
          // A. Logged in, but Pins are NOT Set (New User)
          if (segments[0] !== "setup-pins") {
            router.replace("/setup-pins");
          }
        } else if (isAuthGroup) {
          // B. Logged in, Pins ARE Set, and user is stuck in the (auth) group
          router.replace("/pin-check");
        }
      }
    }, 100); // 100ms delay

    return () => clearTimeout(timer); // Cleanup function for safety
  }, [
    user,
    isLoading,
    settings,
    isSettingsLoading,
    isAuthGroup,
    segments,
    canRedirect,
    router,
  ]); // Render null while the guard is still deciding or contexts are loading

  if (!isReady) {
    // Optional: You can return a simple loading screen here instead of null
    return null;
  } // Render the main navigation stack when ready

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      <Stack.Screen name="pin-check" options={{ headerShown: false }} />
      <Stack.Screen name="duress-decoy" options={{ headerShown: false }} />
      <Stack.Screen name="setup-pins" options={{ headerShown: false }} />
    </Stack>
  );
}
// --- End Navigation Guard ---

// --- The Root Layout Component (Wraps App in Providers) ---
export default function RootLayout() {
  return (
    // Stack all necessary providers first
    <AuthProvider>
      <SettingsProvider>
        <LocationProvider>
          <RootNavigationGuard />
        </LocationProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
