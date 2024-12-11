import { TextInput, TextInputProps, StyleSheet } from "react-native";

type CustomInputProps = TextInputProps & {
  value: string;
  onChangeText: (text: string) => void;
};

export function CustomInput({
  value,
  onChangeText,
  ...props
}: CustomInputProps) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
});
