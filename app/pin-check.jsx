import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";

import { InputField } from "../components/InputField";
import { PrimaryButton } from "../components/PrimaryButton";

// Assuming you have an alertService.js file
import { initiateSOS } from "./services/alertService";

export default function PinCheckScreen() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { settings } = useSettings();
  const { userId, emergencyContacts } = useAuth();

  const handlePinSubmit = async () => {
    if (pin.length !== 4) {
      Alert.alert("Invalid PIN", "PIN must be 4 digits.");
      return;
    }

    setLoading(true);

    const enteredPin = pin;
    setPin("");

    // --- 1. CHECK DURESS PIN ---
    if (enteredPin === settings.duressPin) {
      console.log("🚨 Duress PIN entered. Initiating SILENT SOS.");

      const result = await initiateSOS(
        userId,
        "duress_pin", // Identify the trigger method
        emergencyContacts
      );

      setLoading(false);

      if (result.success) {
        // 1. SUCCESS: Show decoy message (The attacker sees this)
        Alert.alert(
          "Access Denied",
          "Incorrect PIN. Please try again or contact support."
        );
        // 2. CRITICAL: Navigate to the Decoy Screen
        router.replace("/duress-decoy");
      } else {
        // Error handling if alert failed
        Alert.alert(
          "System Error",
          "Duress alert failed. Please try the Normal SOS."
        );
        router.replace("/duress-decoy");
      }
      return;
    }
    // --- 2. CHECK NORMAL PIN ---
    else if (enteredPin === settings.normalPin) {
      console.log("✅ Normal PIN entered. Granting access.");

      setLoading(false);
      // Alert.alert("Access Granted", "Welcome back."); // Removed for smoother flow
      router.replace("/(protected)/home");
      return;
    }
    // --- 3. INVALID PIN ---
    else {
      setLoading(false);
      Alert.alert("Access Denied", "Incorrect PIN. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed" size={40} color="#FF4500" />
        </View>

        <Text style={styles.title}>RapidSafe Locked</Text>
        <Text style={styles.subtitle}>
          Enter your 4-digit PIN to access the application.
        </Text>

        <View style={styles.inputContainer}>
          <InputField
            label=""
            value={pin}
            onChangeText={setPin}
            placeholder="0000"
            keyboardType="numeric"
            secureTextEntry={true}
            maxLength={4}
            style={{ textAlign: "center" }}
          />
        </View>

        <PrimaryButton
          title="Unlock App"
          onPress={handlePinSubmit}
          loading={loading}
          disabled={pin.length !== 4}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7FAFC" },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#FEB2B2",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A202C",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    marginBottom: 40,
    maxWidth: "80%",
    lineHeight: 24,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 300,
    marginBottom: 20,
  },
});
