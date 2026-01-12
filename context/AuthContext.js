import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const USER_CREDENTIALS_KEY = "@local_user_credentials";

const getLocalCredentials = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_CREDENTIALS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch (e) {
    console.error("Failed to load local credentials:", e);
    return {};
  }
};

// Helper to save the entire user list back to storage
const saveLocalCredentials = async (users) => {
  try {
    const jsonValue = JSON.stringify(users);
    await AsyncStorage.setItem(USER_CREDENTIALS_KEY, jsonValue);
    return true;
  } catch (e) {
    console.error("Failed to save local credentials:", e);
    return false;
  }
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Key used to store the mock user session data
  const SESSION_KEY = "userSessionToken";

  // --- Session Persistence Logic (Loads user on startup) ---
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(SESSION_KEY);
        if (storedUser) {
          // If a token/user ID is found, parse it and set the user state
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to load session:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  // --- Auth Actions ---
  const signUp = async (phoneNumber, password, username) => {
    // Using phoneNumber/password from your typical flow
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Mock delay

    const users = await getLocalCredentials();

    if (users[phoneNumber]) {
      // User already exists
      setIsLoading(false);
      return {
        success: false,
        message: "An account already exists for this number.",
      };
    } // Create and save the new user's mock credentials

    const newUser = {
      phoneNumber,
      hashedPassword: password + "::LOCAL_SALT",
      id: Date.now().toString(),
      displayName: username,
    };
    users[phoneNumber] = newUser;
    await saveLocalCredentials(users);

    setIsLoading(false);
    return { success: true, userDetails: newUser };
  };
  const signIn = async (phoneNumber, password) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Mock delay

    const users = await getLocalCredentials();
    const storedUser = users[phoneNumber];

    if (!storedUser) {
      setIsLoading(false);
      return {
        success: false,
        message: "User not found. Please check your credentials.",
      };
    } // Check password against the stored "hash"

    if (storedUser.hashedPassword === password + "::LOCAL_SALT") {
      // Success! Persist the session and set state
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(storedUser));
      setUser(storedUser);
      setIsLoading(false);
      return { success: true };
    } else {
      // Failure: Password mismatch
      setIsLoading(false);
      return { success: false, message: "Invalid phone number or password." };
    }
  };

  const verifyOTP = async (otp, userDetails) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay

    // In a real app, verifying the code happens server-side.
    // For this mock, we'll accept any 6-digit code.
    if (otp.length === 6) {
      // If verification is successful (and it's a registration flow),
      // we should log the user in (persist session).
      if (userDetails) {
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(userDetails));
        setUser(userDetails);
      }
      setIsLoading(false);
      return { success: true };
    } else {
      setIsLoading(false);
      return { success: false, message: "Invalid OTP code." };
    }
  };

  const signOut = async () => {
    // ... (Sign out remains the same) ...
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  }; // 🚨 IMPORTANT: Update the value object to include signUp

  const value = { user, signIn, signOut, signUp, verifyOTP, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
