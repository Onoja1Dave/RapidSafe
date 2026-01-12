// app/components/InputField.jsx
import { StyleSheet, Text, TextInput, View } from "react-native";

export const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType = "default",
  maxLength,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.errorInput,
          // Special styling for PIN/Numeric fields center aligned
          (keyboardType === "numeric" || maxLength === 4) && styles.centerText,
        ]}
        value={value}
        onChangeText={onChangeText}
        // Only show placeholder if explicitly needed, otherwise keep it clean as requested
        placeholder={placeholder}
        placeholderTextColor="#A0A0A0"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize="none"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    color: "#4A5568", // Slate gray for better readability
    marginBottom: 8,
    fontWeight: "600",
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#F7FAFC", // Light gray background (Modern filled style)
    borderWidth: 0, // No border by default
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16, // Softer corners
    fontSize: 16,
    color: "#2D3748",
    // Subtle shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  centerText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 4, // Spacing for PINs
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "#FF4500",
    backgroundColor: "#FFF5F5",
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default InputField;
