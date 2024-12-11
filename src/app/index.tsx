import { Text, View, StyleSheet } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import { getCurrentUser } from "../utils/storage";

export default function Index() {
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    if (user) {
      router.replace("/list");
    } else {
      router.replace("/login");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
