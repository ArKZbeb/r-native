import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
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
      <View style={styles.Viewtitle}>
        <Text style={styles.title}>Historique des parties</Text>
      </View>
      <FlatList
        style={styles.list}
        data={[...history].reverse()}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => handleGamePress(item.id)}>
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.date}</Text>
              <Text style={styles.itemText}>
                Score: {item.score} / {item.questions.length}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.startGameBtn}
        onPress={() => handlePress()}
      >
        <Text style={styles.startGameBtnText}>Lancer une partie</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(233, 236, 239)",
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    marginBottom: 20,
    color: "whitesmoke",
  },
  startGameBtn: {
    backgroundColor: "rgb(78, 179, 74)",
    height: 80,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  startGameBtnText: {
    fontSize: 20,
    color: "whitesmoke",
    textAlign: "center",
  },
  Viewtitle: {
    backgroundColor: "rgb(233, 236, 239)",
    padding: 10,
  },

  title: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 5,
  },
  list: {
    display: "flex",
    paddingHorizontal: 10,
  },
  item: {
    marginVertical: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
    gap: 10,
    backgroundColor: "rgb(248, 249, 250)",
    borderRadius: 12,
    boxShadow: "rgba(100, 100, 111, 0.3) 0px 5px 5px 0px",
    borderColor: "rgba(153, 153, 155, 0.3)",
    borderWidth: 1,
  },
  itemText: {
    fontSize: 18,
    marginBottom: 5,
  },
});
