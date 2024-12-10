import { Stack } from "expo-router";
import { createTheme, ThemeProvider } from "@rneui/themed";
import { SafeAreaProvider } from "react-native-safe-area-context";

const theme = createTheme({
  lightColors: {},
  darkColors: {},
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <Stack />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
