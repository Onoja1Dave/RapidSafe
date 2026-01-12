import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";

// --- Custom Components ---

const SettingsGroup = ({ title, children }) => (
  <View style={styles.groupContainer}>
    {title && <Text style={styles.groupTitle}>{title}</Text>}
    <View style={styles.groupBody}>{children}</View>
  </View>
);

const SettingsItem = ({
  icon,
  title,
  value,
  onPress,
  isLast = false,
  color = "#333",
  hideArrow = false,
  destructive = false,
}) => (
  <TouchableOpacity
    style={[styles.item, isLast && styles.itemLast]}
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.iconBox, { backgroundColor: destructive ? "#FEE2E2" : "#F2F2F7" }]}>
        <Ionicons name={icon} size={20} color={destructive ? "#FF3B30" : "#007AFF"} />
    </View>
    <Text style={[styles.itemTitle, destructive && { color: "#FF3B30", fontWeight: "600" }]}>{title}</Text>
    {value && <Text style={styles.itemValue}>{value}</Text>}
    {!hideArrow && (
      <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
    )}
  </TouchableOpacity>
);

const SettingsToggle = ({
  icon,
  title,
  isEnabled,
  onToggle,
  isLast = false,
}) => (
  <View style={[styles.item, isLast && styles.itemLast]}>
    <View style={styles.iconBox}>
        <Ionicons name={icon} size={20} color="#007AFF" />
    </View>
    <Text style={styles.itemTitle}>{title}</Text>
    <Switch 
        value={isEnabled} 
        onValueChange={onToggle}
        trackColor={{ false: "#767577", true: "#34C759" }}
        thumbColor={"#f4f3f4"}
    />
  </View>
);

// --- Main Component ---

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { settings, setSettings } = useSettings(); 

  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);
  const [isAlertSoundEnabled, setIsAlertSoundEnabled] = useState(true);

  const displayName = user?.displayName || "RapidSafe User";
  const phoneNumber = settings?.userPhoneNumber || user?.phoneNumber || "N/A";
  const contactsCount = settings?.emergencyContacts?.length || 0;
  const pinStatus = settings?.isPinSet ? "Active" : "Pending";

  // --- Handlers ---
  const handleSignOut = () => {
     Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: () => signOut() },
      ]
    );
  };

  const toggleLocation = () => {
    setSettings((prev) => ({
      ...prev,
      isLocationSharing: !prev.isLocationSharing,
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
         <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- Profile Card --- */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
             <Text style={styles.avatarText}>{displayName[0]}</Text>
          </View>
          <View>
             <Text style={styles.userName}>{displayName}</Text>
             <Text style={styles.userPhone}>{phoneNumber}</Text>
          </View>
        </View>

        {/* --- Safety Setup --- */}
        <SettingsGroup title="Safety">
          <SettingsItem
            icon="people"
            title="Emergency Contacts"
            value={contactsCount}
            onPress={() => router.push("/contacts")}
          />
          <SettingsItem
            icon="lock-closed"
            title="Security PINs"
            value={pinStatus}
            onPress={() => router.push("/settings/change-pins")}
            isLast
          />
        </SettingsGroup>

        {/* --- Preferences --- */}
        <SettingsGroup title="Preferences">
          <SettingsToggle
            icon="location"
            title="Location Sharing"
            isEnabled={settings?.isLocationSharing || false}
            onToggle={toggleLocation}
          />
          <SettingsToggle
            icon="notifications"
            title="Critical Alerts"
            isEnabled={isAlertSoundEnabled}
            onToggle={() => setIsAlertSoundEnabled(!isAlertSoundEnabled)}
          />
          <SettingsToggle
            icon="finger-print"
            title="Biometric Login"
            isEnabled={isBiometricsEnabled}
            onToggle={() => setIsBiometricsEnabled(!isBiometricsEnabled)}
            isLast
          />
        </SettingsGroup>

        {/* --- Support --- */}
        <SettingsGroup title="Support">
          <SettingsItem
            icon="document-text"
            title="Privacy Policy"
            onPress={() => Alert.alert("Privacy", "Opening Policy...")}
          />
          <SettingsItem
            icon="help-circle"
            title="Help & Support"
            onPress={() => Alert.alert("Help", "Opening Help Center...")}
            isLast
          />
        </SettingsGroup>

        {/* --- Danger Zone --- */}
        <SettingsGroup>
          <SettingsItem
            icon="log-out"
            title="Sign Out"
            destructive
            hideArrow
            onPress={handleSignOut}
            isLast
          />
        </SettingsGroup>
        
        <Text style={styles.versionText}>v1.0.0 (Build 124)</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F2F2F7" },
  header: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: "#F2F2F7",
  },
  headerTitle: { fontSize: 30, fontWeight: "800", color: "#000" },
  scrollContent: { paddingBottom: 40 },
  
  profileCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 16,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
  },
  avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#E5E5EA",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
  },
  avatarText: { fontSize: 24, fontWeight: "700", color: "#8E8E93" },
  userName: { fontSize: 20, fontWeight: "700", color: "#1A202C" },
  userPhone: { fontSize: 14, color: "#8E8E93", marginTop: 2 },
  
  groupContainer: { marginHorizontal: 20, marginBottom: 25 },
  groupTitle: {
    fontSize: 13,
    color: "#6D6D72",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 12,
  },
  groupBody: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingVertical: 14,
    marginLeft: 16, // Inset separator
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  itemLast: { borderBottomWidth: 0 },
  iconBox: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: "#F2F2F7",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
  },
  itemTitle: { fontSize: 16, flex: 1, fontWeight: "500", color: "#1A202C" },
  itemValue: { fontSize: 16, color: "#8E8E93", marginRight: 8 },
  versionText: { textAlign: "center", color: "#C7C7CC", fontSize: 12, marginTop: 10 },
});
