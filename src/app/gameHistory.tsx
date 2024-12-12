import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { getGameHistory, getGameById } from "@/utils/gameHistory";
import { GameHistory } from "@/models/gameHistory";
import { useAuth } from "@/context/AuthContext";
import { router, useLocalSearchParams } from "expo-router";

export default function GameHistoryScreen() {
  const [history, setHistory] = useState<GameHistory[]>([]);
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  const [game, setGame] = useState<GameHistory | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        const gameHistory = await getGameHistory(user.id);
        setHistory(gameHistory);
      }
    };

    fetchHistory();
  }, [user]);

  useEffect(() => {
    if (typeof id === 'string' && user) {
      const fetchGame = async () => {
        const game = await getGameById(user.id, id);
        setGame(game);
      };

      fetchGame();
    }
  }, [id, user]);

  if (!user) {
    return null;
  }

  if (id && game) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Détails de la partie</Text>
        <View style={styles.detailItem}>
          <Text style={styles.detailText}>Date: {game.date}</Text>
          <Text style={styles.detailText}>Score: {game.score}</Text>
          <Text style={styles.detailText}>Questions:</Text>
          {game.questions.map((question, index) => (
            <Text key={index} style={styles.questionText}>{index + 1}. {question}</Text>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Historique des parties</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => router.push(`/gameHistory?id=${item.id}`)}>
            <View style={styles.item}>
              <Text style={styles.itemTitle}>Partie {index + 1}</Text>
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
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginVertical: 5,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemText: {
    fontSize: 16,
    color: "#555",
  },
  detailItem: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginVertical: 5,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
});