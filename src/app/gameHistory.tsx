import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getGameHistory } from "@/utils/gameHistory";
import { GameHistory } from "@/models/gameHistory";
import { useAuth } from "@/context/AuthContext";

export default function GameHistoryScreen() {
  const [history, setHistory] = useState<GameHistory[]>([]);
  const { user } = useAuth();

  if (user === null) {
    return null;
  }

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        const gameHistory = await getGameHistory(user.id);
        setHistory(gameHistory);
      }
    };

    fetchHistory();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique des parties</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Date: {item.date}</Text>
            <Text>Score: {item.score}</Text>
            <Text>Questions: {item.questions.join(", ")}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});