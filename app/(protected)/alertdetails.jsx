import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useSettings } from "../../context/SettingsContext";

const ALERT_CATEGORIES = [
  { name: "Personal Safety", icon: "shield-checkmark-outline", color: "#EF4444" }, // Red
  { name: "Medical", icon: "fitness-outline", color: "#3B82F6" },         // Blue
  { name: "Fire / Hazard", icon: "flame-outline", color: "#F59E0B" },    // Orange
  { name: "Car Accident", icon: "car-outline", color: "#6366F1" },       // Indigo
];

// --- Sub-components ---

const CategoryTile = ({ item, isSelected, onSelect }) => {
    return (
        <TouchableOpacity 
            style={[
                styles.tile, 
                isSelected && { backgroundColor: item.color, borderColor: item.color }
            ]}
            onPress={() => onSelect(item.name)}
            activeOpacity={0.8}
        >
            <Ionicons 
                name={item.icon} 
                size={32} 
                color={isSelected ? "#fff" : item.color} 
            />
            <Text style={[styles.tileText, isSelected && styles.tileTextSelected]}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );
};

const ContactCheckbox = ({ contact, isSelected, onToggle }) => (
    <TouchableOpacity 
        style={[styles.contactRow, isSelected && styles.contactRowSelected]} 
        onPress={() => onToggle(contact.id)}
    >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
        </View>
        <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactPhone}>{contact.phoneNumber}</Text>
        </View>
    </TouchableOpacity>
);

// --- Main Screen ---

export default function AlertContextScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addHistoryItem, settings } = useSettings();
  const allContacts = settings?.emergencyContacts || [];
  
  const [selectedCategory, setSelectedCategory] = useState(ALERT_CATEGORIES[0].name);
  const [description, setDescription] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState(allContacts.map((c) => c.id));
  const [isSending, setIsSending] = useState(false);

  // Animation values
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (params.contactId) {
      setSelectedRecipients([params.contactId]);
      setDescription(`Individual SOS for ${params.contactName}`);
    }
  }, [params.contactId, params.contactName]);

  useEffect(() => {
      if (isSending) {
          pulse.value = withRepeat(
              withSequence(withTiming(1.2, { duration: 500 }), withTiming(1, { duration: 500 })),
              -1,
              true
          );
      } else {
          pulse.value = 1;
      }
  }, [isSending]);

  const sendingStyle = useAnimatedStyle(() => ({
      transform: [{ scale: pulse.value }],
  }));

  const toggleRecipient = (contactId) => {
    setSelectedRecipients((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId]
    );
  };

  const handleSendAlert = () => {
    if (selectedRecipients.length === 0) {
      Alert.alert("No Recipients", "Please select at least one contact.");
      return;
    }

    setIsSending(true);
    const selectedContactNames = allContacts
      .filter((c) => selectedRecipients.includes(c.id))
      .map((c) => c.name);

    addHistoryItem({
      type: selectedCategory,
      description: description || "No additional details provided.",
      recipients: selectedContactNames,
      status: "Sent",
      timestamp: new Date().toISOString(), // Ensure timestamp is added
    });

    // Mock Delay
    setTimeout(() => {
      setIsSending(false);
      Alert.alert(
        "🚨 Alert Sent",
        `Emergency alert for "${selectedCategory}" has been dispatched to ${selectedRecipients.length} contacts.`,
        [{ text: "Done", onPress: () => router.back() }]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="close" size={24} color="#1A202C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Alert</Text>
          <View style={{ width: 40 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Urgent Header */}
        <Animated.View incoming={FadeInDown.delay(100).duration(500)}>
            <Text style={styles.sectionLabel}>WHAT'S THE EMERGENCY?</Text>
            <View style={styles.grid}>
                {ALERT_CATEGORIES.map((item) => (
                    <CategoryTile 
                        key={item.name} 
                        item={item} 
                        isSelected={selectedCategory === item.name} 
                        onSelect={setSelectedCategory} 
                    />
                ))}
            </View>
        </Animated.View>

        {/* Description */}
        <Animated.View incoming={FadeInDown.delay(200).duration(500)} style={styles.section}>
            <Text style={styles.sectionLabel}>ADDITIONAL DETAILS (OPTIONAL)</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. I'm at the park, feeling unsafe..."
                multiline
                value={description}
                onChangeText={setDescription}
                textAlignVertical="top"
            />
        </Animated.View>

        {/* Recipients */}
        <Animated.View incoming={FadeInDown.delay(300).duration(500)} style={styles.section}>
            <View style={styles.rowBetween}>
                <Text style={styles.sectionLabel}>NOTIFY CONTACTS</Text>
                <Text style={styles.countLabel}>{selectedRecipients.length} Selected</Text>
            </View>
            <View style={styles.contactList}>
                {allContacts.length === 0 ? (
                    <Text style={styles.emptyText}>No contacts added in Settings.</Text>
                ) : (
                    allContacts.map((contact) => (
                        <ContactCheckbox 
                            key={contact.id} 
                            contact={contact} 
                            isSelected={selectedRecipients.includes(contact.id)}
                            onToggle={toggleRecipient}
                        />
                    ))
                )}
            </View>
        </Animated.View>

      </ScrollView>

      {/* Floating Bottom Bar */}
      <View style={styles.bottomBar}>
          {isSending ? (
              <View style={styles.sendingContainer}>
                  <Animated.View style={[styles.pulseCircle, sendingStyle]} />
                  <ActivityIndicator size="large" color="#fff" style={{ position: 'absolute' }}/>
                  <Text style={styles.sendingText}>DISPATCHING ALERT...</Text>
              </View>
          ) : (
              <PrimaryButton 
                title="SEND ALERT NOW" 
                onPress={handleSendAlert}
                style={styles.sendButton}
                textStyle={{ fontSize: 18, fontWeight: "800", letterSpacing: 1 }}
              />
          )}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7FAFC" },
  header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#1A202C", textTransform: "uppercase", letterSpacing: 1 },
  backButton: { padding: 8, backgroundColor: "#EDF2F7", borderRadius: 20 },
  
  content: { padding: 24, paddingBottom: 120 },
  
  section: { marginBottom: 30 },
  sectionLabel: { fontSize: 12, fontWeight: "700", color: "#A0AEC0", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 },
  
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  tile: {
      width: "48%",
      aspectRatio: 1.4,
      backgroundColor: "#fff",
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#EDF2F7",
  },
  tileText: { marginTop: 8, fontWeight: "600", fontSize: 14, color: "#4A5568" },
  tileTextSelected: { color: "#fff" },
  
  input: {
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 16,
      height: 120,
      fontSize: 16,
      color: "#2D3748",
      borderWidth: 1,
      borderColor: "#EDF2F7",
  },
  
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  countLabel: { fontSize: 12, color: "#007AFF", fontWeight: "600" },
  
  contactList: {
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 8,
      borderWidth: 1,
      borderColor: "#EDF2F7",
  },
  contactRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#F7FAFC",
  },
  contactRowSelected: { backgroundColor: "#F0F9FF" },
  checkbox: {
      width: 20,
      height: 20,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: "#CBD5E0",
      marginRight: 12,
      justifyContent: "center",
      alignItems: "center",
  },
  checkboxSelected: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: "600", color: "#2D3748" },
  contactPhone: { fontSize: 12, color: "#A0AEC0" },
  
  emptyText: { padding: 20, textAlign: "center", color: "#A0AEC0" },
  
  bottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 24,
      paddingBottom: 40,
      backgroundColor: "#fff",
      borderTopWidth: 1,
      borderTopColor: "#EDF2F7",
  },
  sendButton: { backgroundColor: "#EF4444", borderRadius: 16, height: 60 }, // Red for urgency
  
  sendingContainer: {
      height: 60,
      backgroundColor: "#EF4444",
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      overflow: "hidden",
  },
  sendingText: { color: "#fff", fontSize: 16, fontWeight: "800", marginLeft: 10, letterSpacing: 1 },
  pulseCircle: {
      position: "absolute",
      width: 300,
      height: 300,
      borderRadius: 150,
      backgroundColor: "rgba(255,255,255,0.2)",
  },
});

