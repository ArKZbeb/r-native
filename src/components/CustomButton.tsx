import { TouchableOpacity, Text, StyleSheet } from "react-native";

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
};

export function CustomButton({
  title,
  onPress,
  variant = "primary",
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, variant === "secondary" && styles.secondaryButton]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "secondary" && styles.secondaryButtonText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "80%",
    height: 40,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
    marginHorizontal: "auto",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  secondaryButtonText: {
    color: "#007AFF",
  },
});
