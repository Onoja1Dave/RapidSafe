// app/(protected)/history.jsx

import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSettings } from "../../context/SettingsContext";

// Mapping category names to colors
const CATEGORY_COLORS = {
  "Personal Safety": "#FF3B30",
  "Medical Emergency": "#007AFF",
  "Fire / Hazard": "#FF9500",
  "Accident / Crime": "#333333",
};

const StatusChip = ({ status }) => {
  const isSent = status === "Sent" || status === "Delivered";
  return (
    <View style={[styles.chip, { backgroundColor: isSent ? "#E6F4EA" : "#FEF2F2" }]}>
      <Text style={[styles.chipText, { color: isSent ? "#34C759" : "#FF3B30" }]}>
        {status || "Sent"}
      </Text>
    </View>
  );
};

const TimelineItem = ({ item, isLast }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const date = new Date(item.timestamp);
  
  const timeString = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const dateString = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  
  const indicatorColor = CATEGORY_COLORS[item.type] || "#8E8E93";

  return (
    <View style={styles.timelineRow}>
      {/* Time Column */}
      <View style={styles.timeColumn}>
        <Text style={styles.timeText}>{timeString}</Text>
        <Text style={styles.dateLabel}>{dateString}</Text>
      </View>

      {/* Timeline Line & Dot */}
      <View style={styles.lineWrapper}>
        <View style={[styles.dot, { backgroundColor: indicatorColor }]} />
        {!isLast && <View style={styles.line} />}
      </View>

      {/* Card Content */}
      <TouchableOpacity 
        style={styles.cardContainer} 
        activeOpacity={0.9}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.cardHeader}>
           <Text style={styles.cardTitle}>{item.type}</Text>
           <StatusChip status={item.status} />
        </View>
        
        <Text style={styles.description} numberOfLines={isExpanded ? 0 : 2}>
           {item.description || "No specific details provided."}
        </Text>
        
        {isExpanded && (
          <View style={styles.expandedContent}>
             <View style={styles.divider} />
             <Text style={styles.detailLabel}>Recipients:</Text>
             <Text style={styles.detailValue}>
               {Array.isArray(item.recipients) ? item.recipients.join(", ") : item.recipients}
             </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default function HistoryScreen() {
  const { settings } = useSettings();
  const historyData = settings?.history || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: "Alert History", headerShown: false }} />

      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <TouchableOpacity style={styles.filterBtn}>
           <Ionicons name="filter" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <TimelineItem 
            item={item} 
            isLast={index === historyData.length - 1} 
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
               <Ionicons name="time-outline" size={48} color="#A0AEC0" />
            </View>
            <Text style={styles.emptyTitle}>No Alerts Yet</Text>
            <Text style={styles.emptyText}>Any alerts you send will appear here.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7FAFC" },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 15,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  title: { fontSize: 28, fontWeight: "800", color: "#1A202C" },
  filterBtn: { padding: 8, backgroundColor: "#F2F2F7", borderRadius: 8 },
  listContent: { padding: 20 },
  
  // Timeline Styles
  timelineRow: { flexDirection: "row", marginBottom: 20 },
  timeColumn: { width: 60,  alignItems: "flex-end", marginRight: 15, paddingTop: 2 },
  timeText: { fontSize: 13, fontWeight: "700", color: "#2D3748" },
  dateLabel: { fontSize: 11, color: "#A0AEC0", marginTop: 2 },
  
  lineWrapper: { alignItems: "center", width: 20 },
  dot: { width: 12, height: 12, borderRadius: 6, zIndex: 2, borderWidth: 2, borderColor: "#fff" },
  line: { width: 2, flex: 1, backgroundColor: "#E2E8F0", marginTop: -2,  marginBottom: -20 },
  
  cardContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#2D3748" },
  description: { fontSize: 14, color: "#718096", lineHeight: 20 },
  
  chip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  chipText: { fontSize: 11, fontWeight: "700" },
  
  divider: { height: 1, backgroundColor: "#F2F2F7", marginVertical: 12 },
  expandedContent: { marginTop: 5 },
  detailLabel: { fontSize: 12, fontWeight: "600", color: "#A0AEC0", marginBottom: 4 },
  detailValue: { fontSize: 14, color: "#4A5568" },

  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#EDF2F7", justifyContent: "center", alignItems: "center", marginBottom: 15 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#2D3748", marginBottom: 5 },
  emptyText: { fontSize: 14, color: "#A0AEC0" },
});
