import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { InputField } from "../../components/InputField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useSettings } from "../../context/SettingsContext";

export default function SetupPinsScreen() {
  const [normalPin, setNormalPin] = useState("");
  const [duressPin, setDuressPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { saveInitialPins } = useSettings();

  const handleSavePins = async () => {
    // --- Validation ---
    if (normalPin.length !== 4 || duressPin.length !== 4) {
      Alert.alert("Invalid PINs", "Both PINs must be 4 digits long.");
      return;
    }
    if (normalPin === duressPin) {
      Alert.alert(
        "Security Warning",
        "The Normal PIN and Duress PIN cannot be the same. Please choose different codes."
      );
      return;
    }
    if (normalPin !== confirmPin) {
      Alert.alert(
        "Mismatch",
        "The Normal PIN and confirmation PIN do not match."
      );
      return;
    }

    setLoading(true);
    const success = await saveInitialPins(normalPin, duressPin);
    setLoading(false);

    if (success) {
      Alert.alert(
        "Setup Complete",
        "Your security pins are saved. Welcome to RapidSafe!"
      );
      router.replace("/pin-check");
    } else {
      Alert.alert("Error", "Failed to save pins. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Secure Your App</Text>
            <Text style={styles.subtitle}>
              Set up your access codes. These are crucial for your safety.
            </Text>
          </View>

          {/* Normal PIN Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Access PIN</Text>
            <InputField
              label="Create 4-Digit PIN"
              value={normalPin}
              onChangeText={setNormalPin}
              placeholder="0000"
              keyboardType="numeric"
              secureTextEntry={true}
              maxLength={4}
            />
            <InputField
              label="Confirm PIN"
              value={confirmPin}
              onChangeText={setConfirmPin}
              placeholder="0000"
              keyboardType="numeric"
              secureTextEntry={true}
              maxLength={4}
            />
          </View>

          {/* Duress PIN Section */}
          <View style={styles.duressCard}>
            <View style={styles.duressHeader}>
              <Ionicons name="warning" size={24} color="#C53030" />
              <Text style={styles.duressTitle}>2. Duress PIN (Silent SOS)</Text>
            </View>
            <Text style={styles.duressDescription}>
              If forced to unlock your phone, enter this code instead. It will
              unlock the app but **silently alert** your contacts.
            </Text>
            <InputField
              label="Duress PIN (Different from above)"
              value={duressPin}
              onChangeText={setDuressPin}
              placeholder="0000"
              keyboardType="numeric"
              secureTextEntry={true}
              maxLength={4}
              style={{ marginTop: 10 }}
            />
          </View>

          <View style={styles.spacer} />

          <PrimaryButton
            title="Save Pins & Finish Setup"
            onPress={handleSavePins}
            loading={loading}
            disabled={
              normalPin.length !== 4 ||
              duressPin.length !== 4 ||
              normalPin !== confirmPin
            }
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  container: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    flexGrow: 1,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A202C",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#718096",
    lineHeight: 24,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 15,
  },
  duressCard: {
    backgroundColor: "#FFF5F5",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#FEB2B2",
  },
  duressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  duressTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#C53030",
    marginLeft: 10,
  },
  duressDescription: {
    fontSize: 14,
    color: "#742A2A",
    lineHeight: 20,
    marginBottom: 15,
  },
  spacer: {
    height: 20,
  },
});
