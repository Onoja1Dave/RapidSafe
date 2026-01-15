
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
      
          (keyboardType === "numeric" || maxLength === 4) && styles.centerText,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
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
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  centerText: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
  },
  errorInput: {
    borderColor: "#FF4500",
    borderWidth: 2,
  },
  errorText: {
    color: "#FF4500",
    fontSize: 12,
    marginTop: 4,
  },
});

export default InputField;
