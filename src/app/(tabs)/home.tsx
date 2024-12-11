import { Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { getCurrentUser, saveCurrentUser } from "../../utils/storage";
import { User } from "../../types/auth.types";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcome}>Bienvenue {user?.email}!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: "rgb(20 0 102)",
    paddingVertical: 30,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcome: {
    fontSize: 20,
    marginBottom: 20,
    color:'whitesmoke'
  },
});
