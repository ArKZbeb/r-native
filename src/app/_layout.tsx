import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { useEffect } from "react";
import { useSegments, useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Redirect to sign-in if user is not signed in and trying to access protected pages
      router.replace("/sign-in");
    } else if (user && inAuthGroup) {
      // Redirect to home if user is signed in and trying to access auth pages
      router.replace("/list");
    }
  }, [user, segments, isLoading]);

  if (isLoading) {
    // You might want to add a loading screen here
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
