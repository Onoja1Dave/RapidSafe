import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InputField } from "../../components/InputField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useSettings } from "../../context/SettingsContext";

// --- Components ---

const ContactCard = ({ contact, onDelete, onCall, onMessage }) => {
  const getInitials = (name) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  // Generate a consistent color based on the name length
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];
  const avatarColor = colors[contact.name.length % colors.length];

  return (
    <View style={cardStyles.container}>
      <View style={[cardStyles.avatar, { backgroundColor: avatarColor }]}>
        <Text style={cardStyles.avatarText}>{getInitials(contact.name)}</Text>
      </View>
      
      <View style={cardStyles.info}>
        <Text style={cardStyles.name}>{contact.name}</Text>
        <Text style={cardStyles.phone}>{contact.phoneNumber}</Text>
      </View>

      <View style={cardStyles.actions}>
        <TouchableOpacity style={cardStyles.actionBtn} onPress={onCall}>
           <Ionicons name="call" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity style={cardStyles.actionBtn} onPress={onDelete}>
           <Ionicons name="trash-outline" size={20} color="#FF4500" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ... imports unchanged ...

const AddContactForm = ({ onAdd, loading }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    if (name && phone) {
      onAdd(name, phone);
      setName("");
      setPhone("");
      setIsExpanded(false); // Close form after adding
    }
  };

  if (!isExpanded) {
    return (
      <TouchableOpacity 
        style={formStyles.collapsedButton} 
        onPress={() => setIsExpanded(true)}
        activeOpacity={0.8}
      >
        <View style={formStyles.addIconCircle}>
            <Ionicons name="add" size={24} color="#fff" />
        </View>
        <Text style={formStyles.collapsedText}>Add New Contact</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={formStyles.container}>
      <View style={formStyles.headerRow}>
        <Text style={formStyles.title}>New Contact</Text>
        <TouchableOpacity onPress={() => setIsExpanded(false)}>
            <Ionicons name="close" size={24} color="#A0AEC0" />
        </TouchableOpacity>
      </View>
      
      <InputField
        label="Full Name"
        value={name}
        onChangeText={setName}
        placeholder="e.g. Mom"
      />
      <InputField
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        placeholder="+1 234 567 8900"
        keyboardType="phone-pad"
      />
      <PrimaryButton
        title="Save Contact"
        onPress={handleSubmit}
        disabled={!name || !phone || loading}
        loading={loading}
        style={{ marginTop: 10 }}
      />
    </View>
  );
};

// --- Main Screen ---

export default function ContactsScreen() {
  const router = useRouter();
  const { settings, setSettings } = useSettings();
  const contacts = settings?.emergencyContacts || [];
  
  const [loading, setLoading] = useState(false);

  const handleAdd = async (name, phoneNumber) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 500));
    
    const newContact = { 
        id: Date.now().toString(), 
        name, 
        phoneNumber 
    };
    
    setSettings(prev => ({
        ...prev,
        emergencyContacts: [newContact, ...prev.emergencyContacts]
    }));
    
    setLoading(false);
    Alert.alert("Success", "Contact added successfully!");
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Contact", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        { 
            text: "Delete", 
            style: "destructive",
            onPress: () => {
                setSettings(prev => ({
                    ...prev,
                    emergencyContacts: prev.emergencyContacts.filter(c => c.id !== id)
                }));
            }
        }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Contacts</Text>
        </View>

        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <AddContactForm onAdd={handleAdd} loading={loading} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={48} color="#CBD5E0" />
                <Text style={styles.emptyText}>No contacts found</Text>
                <Text style={styles.emptySubText}>Add people you trust to notify in emergencies.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <ContactCard
              contact={item}
              onDelete={() => handleDelete(item.id)}
              onCall={() => Alert.alert("Calling", `Dialing ${item.name}...`)}
            />
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7FAFC" },
  keyboardView: { flex: 1 },
  header: {
      paddingHorizontal: 24,
      paddingVertical: 15,
      backgroundColor: "#F7FAFC", // Match background for cleaner look
  },
  headerTitle: { fontSize: 28, fontWeight: "800", color: "#1A202C" },
  listContent: { paddingBottom: 40 },
  emptyState: { alignItems: "center", marginTop: 60, paddingHorizontal: 40 },
  emptyText: { color: "#2D3748", marginTop: 15, fontSize: 18, fontWeight: "600" },
  emptySubText: { color: "#A0AEC0", marginTop: 5, textAlign: "center", lineHeight: 20 },
});

// Removed headerStyles since search is gone

const formStyles = StyleSheet.create({
  // Collapsed Button Styles
  collapsedButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      marginHorizontal: 24,
      marginBottom: 20,
      padding: 16,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 4,
      elevation: 2,
  },
  addIconCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "#007AFF",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
  },
  collapsedText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#2D3748",
  },
  
  // Expanded Form Styles
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#2D3748" },
});


const cardStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 24,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: { fontSize: 18, fontWeight: "700", color: "#fff" },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: "#2D3748" },
  phone: { fontSize: 14, color: "#718096", marginTop: 2 },
  actions: { flexDirection: "row", gap: 10 },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F7FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
});
