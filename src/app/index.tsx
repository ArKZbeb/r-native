import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { CustomButton } from "../components/CustomButton";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
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
