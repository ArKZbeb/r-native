import { useEffect, useState } from "react";
import {
  Text,
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { getQuestionsList } from "@/utils/apiQuestions";
import { Question, Category, Difficulty } from "@/models/question";
import { SafeAreaView } from "react-native-safe-area-context";
import { scheduleNotification } from "@/utils/notifications";
import { saveGame } from "@/utils/game-manager";
import { Game, GameType } from "@/types/game.types";
import { getDifficultyStars } from "@/utils/questions";

export default function List() {
  useEffect(() => {
    scheduleNotification();
  }, []);

  const [items, setItems] = useState<Question[]>([]); // Liste complète
  const [itemsFiltered, setItemsFiltered] = useState<Question[]>([]); // Liste filtrée

  const handlePress = async (item: Question) => {
    const newGame: Game = {
      type: GameType.SINGLE,
      questions: [item],
      questionSelections: [],
      currentQuestion: {
        index: 0,
        isAnswered: false,
        selectedChoice: null,
      },
    };
    await saveGame(newGame);
    router.push("/questionDetail");
  };

  const handleChangeText = (value: string) => {
    if (value === "") {
      setItemsFiltered(items);
    } else {
      const filteredItems = items
        .filter((item) =>
          item.category.toLowerCase().includes(value.toLowerCase())
        )
        .sort((a, b) => a.category.localeCompare(b.category));

      setItemsFiltered(filteredItems);
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      const questions = await getQuestionsList(
        "20",
        Category.any,
        Difficulty.any
      );
      setItems(questions);
      setItemsFiltered(questions);
    };

    fetchQuestions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          onChangeText={handleChangeText}
          placeholder="categorie"
          placeholderTextColor="gray"
        />
      </View>

      <FlatList
        data={itemsFiltered}
        style={styles.list}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handlePress(item)}
          >
            <View style={styles.topItem}>
              <Text style={styles.index}>{`question ${item.id}`}</Text>
              <Text style={styles.difficulty}>
                {getDifficultyStars(item.difficulty)}
              </Text>
            </View>
            <Text>{item.category}</Text>
            <Text style={styles.question}>{item.question}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(20 0 102)",
    flex: 1,
  },
  inputView: {
    backgroundColor: "#0F0032",
    paddingVertical: 8,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "90%",
    marginHorizontal: "auto",
    paddingLeft: 10,
    color: "black",
    backgroundColor: "whitesmoke",
    borderRadius: 10,
  },
  list: {
    display: "flex",
    paddingHorizontal: 10,
  },
  item: {
    marginVertical: 5,
    display: "flex",
    flexDirection: "column",
    padding: 15,
    backgroundColor: "whitesmoke",
    borderRadius: 12,
  },
  topItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  index: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 5,
  },
  difficulty: {
    color: "#FFD700",
  },
  question: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
  },
  answer: {
    fontSize: 14,
    color: "#555",
  },
});
