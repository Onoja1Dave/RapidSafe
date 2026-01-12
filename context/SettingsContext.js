import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

// DUMMY DATA FOR NEW USERS (Only used if nothing is found in storage)
const DUMMY_EMERGENCY_CONTACTS = [
  { id: "c1", name: "Sarah (Sister)", phoneNumber: "+234 801 111 1111" },
  { id: "c2", name: "John (Husband)", phoneNumber: "+234 802 222 2222" },
];

const DEFAULT_SETTINGS = {
  userPhoneNumber: null,
  normalPin: null,
  duressPin: null,
  isPinSet: false,
  emergencyContacts: DUMMY_EMERGENCY_CONTACTS,
  history: [],
  isLocationSharing: false,
  isBiometricsEnabled: false,
  isAlertSoundEnabled: true,
};

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);

  const SETTINGS_KEY = "appSettings"; // Key for AsyncStorage // ----------------------------------------------------- // --- 1. Load Settings on App Startup (Persistence) --- // -----------------------------------------------------

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
        if (storedSettings) {
          const loadedSettings = JSON.parse(storedSettings);
          loadedSettings.isPinSet = !!loadedSettings.normalPin;
          setSettings(loadedSettings);
        }
      } catch (e) {
        console.error("Failed to load settings from storage:", e);
      } finally {
        setIsSettingsLoading(false);
      }
    };
    loadSettings();
  }, []); // ------------------------------------------------------------------- // --- 🚨 FIX: WATCHER FOR AUTOMATIC PERSISTENCE (Handles Contacts) --- // -------------------------------------------------------------------

  useEffect(() => {
    // Only save if loading is complete to prevent overwriting on first load
    if (!isSettingsLoading) {
      const saveSettings = async () => {
        try {
          await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
          console.log("✅ Settings (including contacts) saved automatically.");
        } catch (e) {
          console.error("Failed to save settings via watcher:", e);
        }
      };
      saveSettings();
    }
  }, [settings, isSettingsLoading]); // Trigger whenever settings or loading status changes // ----------------------------------------------------- // --- 3. Save Initial Pins (Used by the /pin-setup) --- // -----------------------------------------------------

  const saveInitialPins = async (normal, duress) => {
    const newSettings = {
      ...settings,
      normalPin: normal,
      duressPin: duress,
      isPinSet: true,
    }; // Using the raw setSettings updates the state, and the useEffect watcher saves it.

    setSettings(newSettings);
    // We can rely on the watcher, but for critical actions like PIN setup,
    // we can force the await for immediate guarantee (optional but safer here).
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      return true;
    } catch (e) {
      console.error("Failed to force save initial PINs:", e);
      return false;
    }
  }; // --- 4. PIN Check Function (Required by /pin-check) ---

  const checkPin = (pin) => {
    return pin === settings.normalPin || pin === settings.duressPin;
  };

  const addHistoryItem = (alertData) => {
    const newItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...alertData,
    };

    setSettings((prev) => ({
      ...prev,
      history: [newItem, ...(prev.history || [])], // Put newest at the top
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings, // 🚨 CRITICAL: EXPOSE THE RAW SETTER
        isSettingsLoading,
        saveInitialPins,
        checkPin,
        addHistoryItem,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
