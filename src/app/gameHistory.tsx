import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { getGameHistory, getGameById } from "@/utils/gameHistory";
import { GameHistory } from "@/models/gameHistory";
import { useAuth } from "@/context/AuthContext";
import { router, useLocalSearchParams } from "expo-router";
import { CustomButton } from "@/components/CustomButton"; // Import CustomButton

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
    if (typeof id === "string" && user) {
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
      <SafeAreaView style={styles.bg}>
        <Text style={styles.text}>Détails de la partie</Text>
        <View style={styles.item}>
          <Text style={styles.itemText}>Date: {game.date}</Text>
          <Text style={styles.itemText}>Score: {game.score}</Text>
          <Text style={styles.itemText}>Questions:</Text>
          {game.questions.map((question, index) => (
            <Text key={index} style={styles.itemText}>
              {index + 1}. {question.question}
            </Text>
          ))}
        </View>
        <CustomButton
          title="Retour à l'accueil"
          onPress={() => router.push("/")}
          variant="secondary"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.bg}>
      <Text style={styles.text}>Historique des parties</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.touchableOpacity}
            onPress={() => router.push(`/gameHistory?id=${item.id}`)}
          >
            <View style={styles.item}>
              <Text style={styles.itemText}>Partie {index + 1}</Text>
              <Text style={styles.itemText}>Date: {item.date}</Text>
              <Text style={styles.itemText}>Score: {item.score}</Text>
              <Text style={styles.itemText}>
                Nombre de questions: {item.questions.length}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        style={styles.flatList}
      />
      <CustomButton
        title="Retour à l'accueil"
        onPress={() => router.push("/")}
        variant="secondary"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "rgb(20 0 102)",
    padding: 20,
  },

  text: {
    textAlign: "center",
    color: "white",
    fontSize: 24,
    marginBottom: 20,
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

  flatList: {
    flex: 1,
  },

  touchableOpacity: {
    marginBottom: 10,
  },
});
