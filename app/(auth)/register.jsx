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

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !username.trim() ||
      !phoneNumber.trim() ||
      phoneNumber.length < 10 ||
      !password.trim()
    ) {
      return Alert.alert(
        "Error",
        "Please complete all fields with valid data."
      );
    }

    setLoading(true);
    const mockCheckResult = await signUp(
      phoneNumber.trim(),
      password.trim(),
      username.trim()
    );

    setLoading(false);

    if (mockCheckResult.success) {
      router.push({
        pathname: "verifyphone",
        params: {
          userJSON: JSON.stringify(mockCheckResult.userDetails),
          flow: "register",
        },
      });
    } else {
      Alert.alert("Registration Failed", mockCheckResult.message);
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join RapidSafe for rapid emergency response.
            </Text>
          </View>

          <View style={styles.form}>
            <InputField
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="e.g. JaneDoe"
            />
            <InputField
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={15}
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
              title={loading ? "Creating Account..." : "Continue"}
              onPress={handleRegister}
              loading={loading}
              disabled={
                loading || !username || phoneNumber.length < 10 || !password
              }
            />
          </View>

          <TouchableOpacity
            onPress={() => router.replace("login")}
            style={styles.footerLink}
          >
            <Text style={styles.footerText}>
              Already a member? <Text style={styles.linkHighlight}>Log In</Text>
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
    marginBottom: 20,
  },
  spacer: {
    height: 20,
  },
  footerLink: {
    marginTop: "auto",
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
