import { View, Text, StyleSheet, Image } from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bienvenue {user?.email}!</Text>
    </View>
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
    color: "whitesmoke",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});
