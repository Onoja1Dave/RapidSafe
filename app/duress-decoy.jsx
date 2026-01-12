// app/duress-decoy.jsx

import { MaterialIcons } from "@expo/vector-icons"; // You'll need to install this package if you haven't
import { Stack } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DuressDecoyScreen() {
  const [displayNumber, setDisplayNumber] = useState("");

  // Function to handle number and symbol presses
  const handlePress = (key) => {
    if (key === "delete") {
      // Delete the last character
      setDisplayNumber(displayNumber.slice(0, -1));
    } else if (key === "call") {
      // Decoy action: show a failed call attempt
      Alert.alert(
        "Call Failed",
        "The number you dialed could not be connected. Try again later."
      );
    } else {
      // Append the number or symbol
      setDisplayNumber(displayNumber + key);
    }
  };

  // Define the structure of the dialer keys
  const dialerKeys = [
    { main: "1", sub: null, key: "1" },
    { main: "2", sub: "A B C", key: "2" },
    { main: "3", sub: "D E F", key: "3" },
    { main: "4", sub: "G H I", key: "4" },
    { main: "5", sub: "J K L", key: "5" },
    { main: "6", sub: "M N O", key: "6" },
    { main: "7", sub: "P Q R S", key: "7" },
    { main: "8", sub: "T U V", key: "8" },
    { main: "9", sub: "W X Y Z", key: "9" },
    { main: "*", sub: null, key: "*" },
    { main: "0", sub: "+", key: "0" },
    { main: "#", sub: null, key: "#" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HIDE HEADER AND PREVENT SWIPING BACK */}
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />

      <View style={styles.container}>
        {/* 1. Number Display Area */}
        <View style={styles.displayArea}>
          <Text style={styles.displayNumberText} numberOfLines={1}>
            {displayNumber || "Enter a number"}
          </Text>
        </View>

        {/* 2. Dialer Keypad */}
        <View style={styles.keypad}>
          {dialerKeys.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.key}
              onPress={() => handlePress(item.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.keyMainText}>{item.main}</Text>
              {item.sub && <Text style={styles.keySubText}>{item.sub}</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* 3. Action Buttons (Call/Delete) */}
        <View style={styles.actionRow}>
          <View style={styles.actionPlaceholder} />

          {/* Call Button (Decoy Action) */}
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => handlePress("call")}
          >
            <MaterialIcons name="call" size={30} color="white" />
          </TouchableOpacity>

          {/* Delete Button */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handlePress("delete")}
          >
            <MaterialIcons name="backspace" size={24} color="#aaa" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  container: { flex: 1, paddingVertical: 50, paddingHorizontal: 20 },

  // --- Display ---
  displayArea: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  displayNumberText: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "300",
  },

  // --- Keypad ---
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  key: {
    width: "30%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  keyMainText: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "300",
  },
  keySubText: {
    fontSize: 12,
    color: "#aaa",
    marginTop: -5,
  },

  // --- Action Row ---
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  actionPlaceholder: {
    width: 60, // Sizing to align the call button centrally
  },
  callButton: {
    width: 65,
    height: 65,
    borderRadius: 40,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
