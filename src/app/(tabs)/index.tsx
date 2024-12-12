import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { CustomButton } from "@/components/CustomButton";
import { getGameHistory } from "@/utils/gameHistory";
import { GameHistory } from "@/models/gameHistory";

export default function Home() {
  const { user } = useAuth();
  const [history, setHistory] = useState<GameHistory[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        const gameHistory = await getGameHistory(user.id);
        setHistory(gameHistory);
      }
    };

    fetchHistory();
  }, [user]);

  const handlePress = () => {
    router.push("/gameConfig");
  };

  const handleGamePress = (gameId: string) => {
    router.push(`/gameHistory?id=${gameId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.startGameBtn}
        onPress={() => handlePress()}
      >
        <Text style={styles.startGameBtnText}>Lancer une partie</Text>
      </TouchableOpacity>
      <Text style={styles.welcome}>Bienvenue {user?.email}!</Text>
      <Text style={styles.title}>Historique des parties</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => handleGamePress(item.id)}>
            <View style={styles.item}>
              <Text style={styles.itemText}>Partie {index + 1}</Text>
              <Text style={styles.itemText}>Date: {item.date}</Text>
              <Text style={styles.itemText}>Score: {item.score}</Text>
              <Text style={styles.itemText}>Nombre de questions: {item.questions.length}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
  startGameBtn: {
    borderColor: "green",
    borderWidth: 1,
    height: 80,
    borderRadius: 10,
    paddingHorizontal: 30,
    marginHorizontal: "auto",
    justifyContent: "center",
  },
  startGameBtnText: {
    fontSize: 20,
    color: "green",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "whitesmoke",
  },
  item: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 18,
    color: "rgb(20 0 102)",
    fontWeight: "600",
    marginBottom: 5,
  },
});