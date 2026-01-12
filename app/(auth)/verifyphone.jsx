// app/(auth)/verifyphone.jsx

import { Stack, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { InputField } from "../../components/InputField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";

export default function VerifyPhoneScreen() {
  const params = useLocalSearchParams();
  const { verifyOTP } = useAuth();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Parse the user details passed from Register Screen
  const userDetails = params.userJSON ? JSON.parse(params.userJSON) : null;
  const flow = params.flow || "register";

  const handleVerify = async () => {
    if (otp.length !== 6) {
      return Alert.alert("Invalid Code", "Please enter the 6-digit code.");
    }

    setLoading(true);

    // Call the context function
    const result = await verifyOTP(otp, userDetails);
    
    setLoading(false);

    if (result.success) {
      Alert.alert("Success", "Phone number verified!");
      // Proceed to Setup Pins
      router.replace("/setup-pins");
    } else {
      Alert.alert("Verification Failed", result.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Confirm Code</Text>
            <Text style={styles.subtitle}>
              We sent a code to {userDetails?.phoneNumber || "your phone"}.
              Enter it below to continue.
            </Text>
          </View>

          <View style={styles.form}>
            <InputField
              label="Verification Code"
              value={otp}
              onChangeText={setOtp}
              placeholder="000 000"
              keyboardType="number-pad"
              maxLength={6}
              style={{ textAlign: "center", fontSize: 24, letterSpacing: 8 }}
            />

            <View style={styles.spacer} />

            <PrimaryButton
              title={loading ? "Verifying..." : "Verify & Continue"}
              onPress={handleVerify}
              loading={loading}
              disabled={loading || otp.length !== 6}
            />
          </View>

          <TouchableOpacity onPress={() => Alert.alert("Resend", "Code resent!")}>
            <Text style={styles.footerText}>
              Didn&apos;t receive the code? <Text style={styles.linkHighlight}>Resend</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A202C",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#718096",
    lineHeight: 24,
  },
  form: {
    marginBottom: 30,
  },
  spacer: {
    height: 10,
  },
  footerText: {
    fontSize: 15,
    color: "#718096",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  linkHighlight: {
    color: "#FF4500",
    fontWeight: "600",
  },
});
