// app/(protected)/settings/change-pins.jsx

import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { useSettings } from "../../../context/SettingsContext";

// Reusing style concept but custom for PINs
const PinField = ({ label, value, onChange }) => (
    <View style={formStyles.field}>
        <Text style={formStyles.label}>{label}</Text>
        <TextInput 
            value={value}
            onChangeText={onChange}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            style={formStyles.input}
            placeholder="••••"
            placeholderTextColor="#CBD5E0"
        />
    </View>
);

export default function ChangePinsScreen() {
  const router = useRouter();
  const { updateSettings } = useSettings();

  const [normalPin, setNormalPin] = useState("");
  const [confirmNormalPin, setConfirmNormalPin] = useState("");
  const [duressPin, setDuressPin] = useState("");
  const [confirmDuressPin, setConfirmDuressPin] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = () => {
    if (normalPin.length !== 4 || duressPin.length !== 4) {
      return Alert.alert("Invalid Length", "PINs must be 4 digits.");
    }
    if (normalPin !== confirmNormalPin) {
      return Alert.alert("Mismatch", "Normal PINs do not match.");
    }
    if (duressPin !== confirmDuressPin) {
       return Alert.alert("Mismatch", "Duress PINs do not match.");
    }
    if (normalPin === duressPin) {
       return Alert.alert("Security Risk", "Normal and Duress PINs cannot be the same.");
    }

    setIsUpdating(true);
    setTimeout(() => {
      updateSettings("normalPin", normalPin);
      updateSettings("duressPin", duressPin);
      updateSettings("isPinSet", true); // Ensure this matches context key
      
      setIsUpdating(false);
      Alert.alert("Success", "Security PINs updated.", [
          { text: "OK", onPress: () => router.back() }
      ]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#1A202C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Change PINs</Text>
          <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.infoCard}>
            <Ionicons name="lock-closed-outline" size={32} color="#007AFF" /> 
            <Text style={styles.infoText}>
                Your <Text style={{fontWeight: '700'}}>Normal PIN</Text> is used for daily access. 
                Your <Text style={{fontWeight: '700', color: '#EF4444'}}>Duress PIN</Text> silently triggers an SOS.
            </Text>
        </View>

        <Text style={styles.sectionTitle}>Normal Access</Text>
        <View style={formStyles.group}>
            <PinField label="New Normal PIN" value={normalPin} onChange={setNormalPin} />
            <View style={formStyles.divider} />
            <PinField label="Confirm Normal PIN" value={confirmNormalPin} onChange={setConfirmNormalPin} />
        </View>

        <Text style={styles.sectionTitle}>Duress (Secret)</Text>
        <View style={formStyles.group}>
            <PinField label="New Duress PIN" value={duressPin} onChange={setDuressPin} />
            <View style={formStyles.divider} />
            <PinField label="Confirm Duress PIN" value={confirmDuressPin} onChange={setConfirmDuressPin} />
        </View>

        <PrimaryButton 
            title="Update Security PINs" 
            onPress={handleSave} 
            loading={isUpdating}
            style={{ marginTop: 20 }}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7FAFC" },
  header: {
      flexDirection: "row", justifyContent: "space-between", alignItems: "center",
      paddingHorizontal: 20, paddingVertical: 15, backgroundColor: "#fff",
      borderBottomWidth: 1, borderBottomColor: "#EDF2F7"
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1A202C" },
  content: { padding: 20 },
  
  infoCard: {
      flexDirection: "row", alignItems: "center", backgroundColor: "#EBF8FF", padding: 16, borderRadius: 16, marginBottom: 30
  },
  infoText: { flex: 1, marginLeft: 16, color: "#2C5282", fontSize: 14, lineHeight: 20 },
  
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#A0AEC0", textTransform: "uppercase", marginBottom: 10, marginLeft: 4 },
});

const formStyles = StyleSheet.create({
    group: {
        backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 30, overflow: "hidden"
    },
    field: {
        padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between"
    },
    label: { fontSize: 16, fontWeight: "500", color: "#2D3748" },
    input: { 
        fontSize: 20, fontWeight: "700", width: 100, textAlign: "right", color: "#1A202C", letterSpacing: 4 
    },
    divider: { height: 1, backgroundColor: "#E2E8F0", marginLeft: 16 }
});

// Mock Touchable for back button
import { TouchableOpacity } from "react-native";
