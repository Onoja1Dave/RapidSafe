// app/(app)/history.jsx

import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSettings } from "../context/SettingsContext";

// Mapping category names to colors for the indicator
const CATEGORY_COLORS = {
  "Personal Safety": "#FF3B30",
  "Medical Emergency": "#007AFF",
  "Fire / Hazard": "#FBC02D",
  "Accident / Crime": "#333333",
};

const AlertLogItem = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 🎯 Use item.timestamp (from our context) instead of item.date
  const formattedDate = new Date(item.timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Determine indicator color based on type
  const indicatorColor = CATEGORY_COLORS[item.type] || "#8E8E93";

  return (
    <View style={logStyles.itemWrapper}>
      <TouchableOpacity
        style={logStyles.itemContainer}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        {/* Left Indicator */}
        <View
          style={[logStyles.typeIndicator, { backgroundColor: indicatorColor }]}
        />

        {/* Content */}
        <View style={logStyles.content}>
          <View style={logStyles.header}>
            <Text style={logStyles.typeText}>{item.type}</Text>
            <Text style={logStyles.dateText}>{formattedDate}</Text>
          </View>
          <Text style={logStyles.summaryText} numberOfLines={1}>
            {item.description || "No details provided."}
          </Text>
          <Text style={logStyles.statusText}>
            Status:{" "}
            <Text style={{ fontWeight: "600", color: "#34C759" }}>
              {item.status || "Sent"}
            </Text>
          </Text>
        </View>

        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#C7C7CC"
        />
      </TouchableOpacity>

      {/* Expanded Details Section */}
      {isExpanded && (
        <View style={logStyles.expandedDetail}>
          <Text style={logStyles.detailLabel}>Recipients:</Text>
          <Text style={logStyles.detailValue}>
            {/* 🎯 Handle both array and single string recipients */}
            {Array.isArray(item.recipients)
              ? item.recipients.join(", ")
              : item.recipients}
          </Text>

          <Text style={logStyles.detailLabel}>Full Description:</Text>
          <Text style={logStyles.detailValue}>{item.description}</Text>
        </View>
      )}
    </View>
  );
};

export default function HistoryScreen() {
  // 🎯 1. Get real data from SettingsContext
  const { settings } = useSettings();
  const historyData = settings?.history || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: "Alert History" }} />

      <View style={styles.header}>
        <Text style={styles.title}>Your Alert Log</Text>
        <Text style={styles.subtitle}>
          Review all past emergency and test alerts.
        </Text>
      </View>

      <FlatList
        // 🎯 2. Use the context data here
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AlertLogItem item={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle-outline" size={50} color="#8E8E93" />
            <Text style={styles.emptyText}>No alerts recorded yet.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// --- KEEP YOUR STYLES EXACTLY AS THEY WERE ---
const logStyles = StyleSheet.create({
  itemWrapper: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  typeIndicator: {
    width: 6,
    height: "100%",
    borderRadius: 3,
    marginRight: 10,
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    paddingRight: 15,
    paddingLeft: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  typeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  dateText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  summaryText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  expandedDetail: {
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
    padding: 15,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
    marginTop: 8,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
  },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#8E8E93",
  },
});
