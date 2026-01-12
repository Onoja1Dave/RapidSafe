// app/(protected)/location-details.jsx

import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

// Mock Map Component (Visual Placeholder)
const MockMapBackground = () => (
  <View style={styles.mapContainer}>
    {/* This mimics the look of a map with a placemarker */}
    <View style={styles.mapGridHorizontal} />
    <View style={styles.mapGridVertical} />
    
    <View style={styles.locationMarkerPulse} />
    <View style={styles.locationMarker}>
         <Ionicons name="location" size={32} color="#EF4444" />
    </View>
    
    <View style={[styles.streetLabel, { top: 100, left: 50 }]}><Text style={styles.streetText}>Main Avenue</Text></View>
    <View style={[styles.streetLabel, { top: 300, right: 80 }]}><Text style={styles.streetText}>2nd Street</Text></View>
  </View>
);

const DetailRow = ({ icon, label, value, color = "#4A5568" }) => (
    <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
            <Ionicons name={icon} size={20} color={color} />
        </View>
        <View>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    </View>
);

export default function LocationDetailsScreen() {
  const router = useRouter();

  const mockLocationData = {
    latitude: 6.5244,
    longitude: 3.3792,
    address: "123 Main St, Springfield",
    city: "Lagos, Nigeria",
    time: "Just now",
    accuracy: "High (within 5m)",
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Background Map */}
      <MockMapBackground />

      {/* Header (Transparent) */}
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                 <Ionicons name="arrow-back" size={24} color="#1A202C" />
            </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Floating Bottom Card */}
      <View style={styles.bottomSheet}>
          <View style={styles.dragHandle} />
          <Text style={styles.sheetTitle}>Live Location</Text>
          
          <DetailRow 
            icon="navigate-circle"
            label="Current Address" 
            value={`${mockLocationData.address}, ${mockLocationData.city}`}
            color="#007AFF"
          />
          
          <View style={styles.divider} />
          
          <View style={styles.dualRow}>
              <DetailRow 
                icon="map"
                label="Coordinates" 
                value={`${mockLocationData.latitude.toFixed(4)}, ${mockLocationData.longitude.toFixed(4)}`}
                color="#F59E0B"
              />
              <DetailRow 
                icon="time"
                label="Last Updated" 
                value={mockLocationData.time}
                color="#10B981"
              />
          </View>
          
          <View style={styles.infoBox}>
               <Ionicons name="shield-checkmark" size={16} color="#059669" />
               <Text style={styles.infoText}>Available to emergency contacts</Text>
          </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E2E8F0" },
  
  // Fake Map Styles
  mapContainer: { 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: width, 
      height: height, 
      backgroundColor: "#F3F4F6" 
  },
  mapGridHorizontal: { 
      position: 'absolute', top: 200, width: "100%", height: 40, backgroundColor: "#E5E7EB", transform: [{ rotate: '-10deg' }]
  },
  mapGridVertical: { 
      position: 'absolute', left: 100, width: 40, height: "100%", backgroundColor: "#E5E7EB", transform: [{ rotate: '-10deg' }] 
  },
  locationMarker: {
      position: 'absolute', top: height * 0.35, left: width * 0.5 - 16,
  },
  locationMarkerPulse: {
      position: 'absolute', top: height * 0.35 + 28, left: width * 0.5 - 20,
      width: 40, height: 12, borderRadius: 20, backgroundColor: "rgba(239, 68, 68, 0.2)"
  },
  streetLabel: { position: "absolute", backgroundColor: "#fff", padding: 4, borderRadius: 4, shadowOpacity: 0.1 },
  streetText: { fontSize: 10, fontWeight: "700", color: "#9CA3AF" },

  // Header
  headerSafeArea: { zIndex: 10 },
  header: { paddingHorizontal: 20, paddingTop: 10 },
  backButton: { 
      width: 40, height: 40, 
      backgroundColor: "#fff", 
      borderRadius: 20, 
      justifyContent: "center", alignItems: "center",
      shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5
  },

  // Bottom Sheet
  bottomSheet: {
      position: "absolute",
      bottom: 30, // Floating effect
      left: 20,
      right: 20,
      backgroundColor: "#fff",
      borderRadius: 24,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
  },
  dragHandle: {
      width: 40, height: 4, backgroundColor: "#E2E8F0", borderRadius: 2, alignSelf: "center", marginBottom: 20
  },
  sheetTitle: {
      fontSize: 22, fontWeight: "800", color: "#1A202C", marginBottom: 20,
  },
  row: { flexDirection: "row", alignItems: "center", marginVertical: 8, flex: 1 },
  iconBox: {
      width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 12,
  },
  label: { fontSize: 12, color: "#718096", fontWeight: "600", textTransform: "uppercase" },
  value: { fontSize: 16, color: "#2D3748", fontWeight: "700", marginTop: 2 },
  
  divider: { height: 1, backgroundColor: "#EDF2F7", marginVertical: 12 },
  dualRow: { flexDirection: "row", justifyContent: "space-between" },
  
  infoBox: {
      marginTop: 20, flexDirection: "row", alignItems: "center", backgroundColor: "#ECFDF5", padding: 12, borderRadius: 12
  },
  infoText: { marginLeft: 8, color: "#047857", fontWeight: "600", fontSize: 13 }
});
