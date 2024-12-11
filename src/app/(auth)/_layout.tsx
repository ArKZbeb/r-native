import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="sign-in"
        options={{
          title: "Sign In",
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: "Create Account",
        }}
      />
    </Stack>
  );
}
