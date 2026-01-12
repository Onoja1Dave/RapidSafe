import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";

// --- Components ---

const SosButton = ({ onLongPress }) => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1, // Infinite loop
      true // Reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={sosStyles.container}>
      {/* Outer Glow Ring */}
      <Animated.View style={[sosStyles.pulseRing, animatedStyle]} />
      
      <TouchableOpacity
        style={sosStyles.button}
        onLongPress={onLongPress}
        activeOpacity={0.9}
        delayLongPress={800} // Slight delay to prevent accidental triggers
      >
        <Ionicons name="alert" size={48} color="#fff" />
        <Text style={sosStyles.text}>SOS</Text>
      </TouchableOpacity>
      <Text style={sosStyles.instruction}>Hold for 3 seconds</Text>
    </View>
  );
};

const LocationCard = ({ address, isLocationEnabled, onPress }) => (
  <TouchableOpacity style={locationStyles.card} onPress={onPress} activeOpacity={0.9}>
    <View
      style={[
        locationStyles.iconContainer,
        { backgroundColor: isLocationEnabled ? "#E6F4FE" : "#FEF2F2" },
      ]}
    >
      <Ionicons
        name={isLocationEnabled ? "location" : "location-outline"}
        size={24}
        color={isLocationEnabled ? "#007AFF" : "#FF3B30"}
      />
    </View>
    <View style={locationStyles.textContainer}>
      <Text style={locationStyles.label}>Current Location</Text>
      <Text style={locationStyles.address} numberOfLines={1}>
        {isLocationEnabled ? address.line1 : "Location Disabled"}
      </Text>
      <Text style={locationStyles.subAddress}>
        {isLocationEnabled
          ? `${address.city} • ${address.timeAgo}`
          : "Tap to enable services"}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
  </TouchableOpacity>
);

const QuickActionTiles = ({ contacts, onActionPress }) => {
  const quickContacts = contacts.slice(0, 4);
  
  // Public Services Data
  const services = [
    { name: "Police", icon: "shield", color: "#007AFF" },
    { name: "Medical", icon: "medkit", color: "#FF3B30" },
    { name: "Fire", icon: "flame", color: "#FF9500" },
    { name: "Helpline", icon: "call", color: "#34C759" },
  ];

  const Tile = ({ label, icon, color, onPress, isContact = false }) => (
    <TouchableOpacity style={tileStyles.card} onPress={onPress}>
      <View style={[tileStyles.iconCircle, { backgroundColor: isContact ? "#F2F2F7" : `${color}15` }]}>
        {isContact ? (
           <Text style={{ fontSize: 18, color: "#333", fontWeight: "700" }}>{icon}</Text>
        ) : (
           <Ionicons name={icon} size={24} color={color} />
        )}
      </View>
      <Text style={tileStyles.label} numberOfLines={1}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={tileStyles.container}>
      <Text style={tileStyles.sectionTitle}>Emergency Services</Text>
      <View style={tileStyles.grid}>
        {services.map((s) => (
          <Tile
            key={s.name}
            label={s.name}
            icon={s.icon}
            color={s.color}
            onPress={() => onActionPress("service", s.name)}
          />
        ))}
      </View>

      <View style={tileStyles.headerRow}>
        <Text style={tileStyles.sectionTitle}>Trusted Contacts</Text>
        <TouchableOpacity onPress={() => onActionPress("navigate", "/contacts")}>
          <Text style={tileStyles.seeAll}>Manage</Text>
        </TouchableOpacity>
      </View>
      
      <View style={tileStyles.grid}>
        {[...Array(4)].map((_, i) => {
           const c = quickContacts[i];
           return c ? (
             <Tile
               key={c.id}
               label={c.name.split(" ")[0]}
               icon={c.name.charAt(0)}
               isContact
               onPress={() => onActionPress("contact", c.phoneNumber)}
             />
           ) : (
             <TouchableOpacity 
                key={i} 
                style={[tileStyles.card, { borderStyle: "dashed", borderWidth: 1, borderColor: "#E5E5EA", elevation: 0 }]}
                onPress={() => onActionPress("navigate", "/contacts")}
             >
                <Ionicons name="add" size={24} color="#C7C7CC" />
                <Text style={[tileStyles.label, { color: "#C7C7CC" }]}>Add</Text>
             </TouchableOpacity>
           );
        })}
      </View>
    </View>
  );
};

// --- Main Screen ---

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { settings } = useSettings();
  
  const contactCount = settings?.emergencyContacts?.length || 0;
  
  // Dummy Data
  // eslint-disable-next-line
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  // eslint-disable-next-line
  const [currentAddress, setCurrentAddress] = useState({
    line1: "123 Main St, Lekki Phase 1",
    city: "Lagos",
    timeAgo: "Just now",
  });

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning,";
    if (hours < 18) return "Good Afternoon,";
    return "Good Evening,";
  };

  const handleAction = (type, payload) => {
    if (type === "navigate") {
      router.push(payload);
    } else if (type === "service") {
      Alert.alert("Emergency Call", `Calling ${payload}...`);
    } else if (type === "contact") {
      Alert.alert("Contact Call", `Calling ${payload}...`);
    }
  };

  const handleSosTrigger = () => {
    if (contactCount === 0) {
      Alert.alert("No Contacts", "Please add emergency contacts first.");
      return;
    }
    router.push("/alertdetails");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.username}>{user?.displayName || "User"}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/settings")} style={styles.avatar}>
             <Text style={styles.avatarText}>{user?.displayName?.[0] || "U"}</Text>
          </TouchableOpacity>
        </View>

        <LocationCard 
          address={currentAddress} 
          isLocationEnabled={isLocationEnabled}
          onPress={() => router.push("/location-details")}
        />

        <SosButton onLongPress={handleSosTrigger} />

        <QuickActionTiles 
           contacts={settings?.emergencyContacts || []}
           onActionPress={handleAction}
        />
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7FAFC" },
  scroll: { paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 20,
  },
  greeting: { fontSize: 14, color: "#718096", marginBottom: 2 },
  username: { fontSize: 24, fontWeight: "700", color: "#1A202C" },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EDF2F7",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  avatarText: { fontSize: 18, fontWeight: "600", color: "#4A5568" },
});

const sosStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
    height: 240, // Ensure space for ring
  },
  pulseRing: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255, 69, 0, 0.15)",
  },
  button: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "#FF4500", // The core red
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF4500",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
    borderWidth: 4,
    borderColor: "#FF6b35",
  },
  text: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    marginTop: 5,
  },
  instruction: {
    marginTop: 20,
    color: "#718096",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
});

const locationStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 10,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: { flex: 1 },
  label: { fontSize: 12, color: "#718096", fontWeight: "600", marginBottom: 2 },
  address: { fontSize: 16, color: "#2D3748", fontWeight: "700" },
  subAddress: { fontSize: 13, color: "#A0AEC0", marginTop: 2 },
});

const tileStyles = StyleSheet.create({
  container: { paddingHorizontal: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#2D3748", marginBottom: 15 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15, marginTop: 25 },
  seeAll: { fontSize: 14, color: "#007AFF", fontWeight: "600" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    width: "48%", // Two columns
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  label: {
     fontSize: 14,
     fontWeight: "600",
     color: "#2D3748",
     flex: 1,
  },
});
