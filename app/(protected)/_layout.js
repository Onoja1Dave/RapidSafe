import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF4500", // Primary Red/Orange
        tabBarInactiveTintColor: "#8E8E93", // iOS Gray
        tabBarStyle: {
          height: Platform.OS === "ios" ? 85 : 65, // Taller modern tabs
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          paddingTop: 10,
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          elevation: 10, // Android shadow
          shadowColor: "#000", // iOS shadow
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      {/* --- 1. VISIBLE TABS --- */}
      
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              color={color} 
              size={24} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="contacts"
        options={{
          title: "Contacts",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "people" : "people-outline"} 
              color={color} 
              size={24} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "time" : "time-outline"} 
              color={color} 
              size={24} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "settings" : "settings-outline"} 
              color={color} 
              size={24} 
            />
          ),
        }}
      />

      {/* --- 2. HIDDEN SUB-SCREENS --- */}
      {/* These handle routing but don't show up in the tab bar */}

      <Tabs.Screen name="alertdetails" options={{ href: null }} />
      <Tabs.Screen name="location-details" options={{ href: null }} />
      <Tabs.Screen name="settings/change-pins" options={{ href: null }} />
      <Tabs.Screen name="pin-check" options={{ href: null }} />
      
      {/* Hidden Catch-alls */}
      <Tabs.Screen name="contacts/add" options={{ href: null }} />
      <Tabs.Screen name="contacts/edit" options={{ href: null }} />
      <Tabs.Screen name="location-required" options={{ href: null }} />
      <Tabs.Screen name="[...missing]" options={{ href: null }} />

      <Tabs.Screen name="addcontact" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      
    </Tabs>
  );
}
