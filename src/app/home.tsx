import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { CustomButton } from "../../components/CustomButton";
import { getCurrentUser, saveCurrentUser } from "../../utils/storage";
import { User } from "../../types/auth.types";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const handleLogout = async () => {
    await saveCurrentUser(null as any);
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bienvenue {user?.email}!</Text>
      <CustomButton
        title="Se déconnecter"
        onPress={handleLogout}
        variant="secondary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcome: {
    fontSize: 20,
    marginBottom: 20,
  },
});
