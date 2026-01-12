import { Alert, Platform } from "react-native";

const universalAlert = (title, message, buttons) => {
  if (Platform.OS === "web") {
    // Basic web implementation
    const confirmButton = buttons?.find((b) => b.style !== "cancel");
    const result = window.confirm(`${title}\n\n${message}`);

    if (result && confirmButton?.onPress) {
      confirmButton.onPress();
    }
  } else {
    // Standard mobile implementation
    Alert.alert(title, message, buttons);
  }
};

export default universalAlert;
