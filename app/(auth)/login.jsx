import { Stack, useRouter } from "expo-router";
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

export default function LoginScreen() {
  const { signIn, isLoading } = useAuth();
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!phoneNumber.trim() || !password.trim()) {
      return Alert.alert(
        "Error",
        "Please enter your phone number and password."
      );
    }

    const result = await signIn(phoneNumber.trim(), password.trim());

    if (result.success) {
      router.replace("/(protected)/home");
    } else {
      Alert.alert("Login Failed", result.message);
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Log in to access your rapid safety tools.</Text>
          </View>

          <View style={styles.form}>
            <InputField
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              autoCapitalize="none"
              placeholder="+234..."
            />
            <InputField
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="******"
            />

            <View style={styles.spacer} />

            <PrimaryButton
              title={isLoading ? "Logging In..." : "Log In"}
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading || !phoneNumber || !password}
            />
          </View>

          <TouchableOpacity
            onPress={() => router.push("register")}
            style={styles.footerLink}
          >
            <Text style={styles.footerText}>
              Don&apos;t have an account? <Text style={styles.linkHighlight}>Register Here</Text>
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
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A202C", // Dark Slate
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#718096",
    lineHeight: 24,
  },
  form: {
    marginBottom: 20,
  },
  spacer: {
    height: 10,
  },
  footerLink: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 15,
    color: "#718096",
  },
  linkHighlight: {
    color: "#FF4500",
    fontWeight: "700",
  },
});
