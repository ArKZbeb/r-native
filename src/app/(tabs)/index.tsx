import { Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

export default function Home() {
  const { user, signOut } = useAuth();

  const handlePress = () => {
    router.push("/gameConfig");
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.startGameBtn}
        onPress={() => handlePress()}
      >
        <Text style={styles.startGameBtnText}>Lancer une partie</Text>
      </TouchableOpacity>
      <Text style={styles.welcome}>dernières parties jouées</Text>
      <Text style={styles.welcome}>Bienvenue {user?.email}!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(20 0 102)",
    paddingVertical: 40,
    flex: 1,
    alignItems: "center",
    gap: 20,
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

  startGameBtn: {
    borderColor: "green",
    borderWidth: 1,
    height: 80,
    borderRadius: 10,
    paddingHorizontal: 30,
    marginHorizontal: "auto",
  },

  startGameBtnText: {
    fontSize: 20,
    color: "green",
    margin: "auto",
  },
});
