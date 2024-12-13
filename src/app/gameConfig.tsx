import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { getQuestionsList } from "@/utils/apiQuestions";
import { Category, Difficulty } from "@/models/question";
import { router } from "expo-router";
import { useState } from "react";
import { saveGame } from "@/utils/game-manager";
import { Game, GameType } from "@/types/game.types";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GameConfig() {
  const [nbOfQuestion, setnbOfQuestion] = useState(3);
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    Category.any
  );
  const [selectedDifficulty, setselectedDifficulty] = useState<Difficulty>(
    Difficulty.any
  );

  const [activeCategory, setActiveCategory] = useState<string>("any");
  const [activeDifficulty, setActiveDifficulty] = useState<string>("any");

  const categoryOptions = Object.keys(Category);
  const DifficultyOptions = Object.keys(Difficulty);

  const handlePressNbOfQuestion = (op: string) => {
    if (op === "minus") {
      const index = nbOfQuestion - 1;
      if (index == 2) return;
      setnbOfQuestion(index);
    } else if (op === "plus") {
      const index = nbOfQuestion + 1;
      setnbOfQuestion(index);
    }
  };

  const handlePressCategory = (item: string) => {
    const value = Category[item as keyof typeof Category];
    setSelectedCategory(value);
    setActiveCategory(item);
  };

  const handlePressDifficulty = (item: string) => {
    setselectedDifficulty(item as Difficulty);
    setActiveDifficulty(item);
  };

  const startGame = async () => {
    const questions = await getQuestionsList(
      `${nbOfQuestion}`,
      selectedCategory,
      selectedDifficulty
    );

    const newGame: Game = {
      type: GameType.QUIZ,
      questions: questions,
      score: 0,
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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Configuration de la partie</Text>
      <View style={styles.list}>
        <Text style={styles.text}>Catégorie</Text>

        <FlatList
          data={categoryOptions}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handlePressCategory(item)}
              style={[
                styles.btnChoice,
                activeCategory === item && styles.activeBtn,
              ]}
            >
              <Text style={styles.btnChoiceText}>{item}</Text>
            </TouchableOpacity>
          )}
        ></FlatList>
      </View>
      <View style={styles.list}>
        <Text style={styles.text}>Difficulté</Text>

        <FlatList
          data={DifficultyOptions}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handlePressDifficulty(item)}
              style={[
                styles.btnChoice,
                activeDifficulty === item && styles.activeBtn,
              ]}
            >
              <Text style={styles.btnChoiceText}>{item}</Text>
            </TouchableOpacity>
          )}
        ></FlatList>
      </View>

      <View style={styles.viewNbQuestion}>
        <TouchableOpacity
          style={styles.btnNbQuestion}
          onPress={() => handlePressNbOfQuestion("minus")}
        >
          <FontAwesome
            style={styles.icon}
            size={22}
            name="minus"
            color={"red"}
          />
        </TouchableOpacity>
        <Text style={styles.textNbQuestion}>{nbOfQuestion}</Text>
        <TouchableOpacity
          style={styles.btnNbQuestion}
          onPress={() => handlePressNbOfQuestion("plus")}
        >
          <FontAwesome
            style={styles.icon}
            size={22}
            name="plus"
            color={"green"}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => startGame()} style={styles.startGameBtn}>
        <Text style={styles.startGameBtnText}>Commencer la partie</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(20 0 102)",
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 10,
  },

  title: {
    textAlign: "center",
    color: "white",
    fontSize: 28,
  },

  text: {
    textAlign: "center",
    color: "white",
    fontSize: 22,
    margin: 10,
  },

  list: {
    marginHorizontal: "auto",
    maxHeight: 200,
    width: "80%",
  },

  btnChoice: {
    backgroundColor: "whitesmoke",
    paddingVertical: 5,
    margin: 5,
    borderRadius: 10,
  },

  btnChoiceText: {
    color: "black",
    textAlign: "center",
    fontSize: 18,
  },

  viewNbQuestion: {
    display: "flex",
    flexDirection: "row",
    width: "50%",
    justifyContent: "space-between",
  },

  textNbQuestion: {
    margin: "auto",
    color: "white",
    fontSize: 26,
  },

  btnNbQuestion: {
    borderColor: "white",
    borderWidth: 1,
    display: "flex",
    padding: 15,
    borderRadius: 10,
  },

  icon: {
    margin: "auto",
  },

  startGameBtn: {
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginHorizontal: "auto",
  },

  startGameBtnText: {
    fontSize: 20,
    color: "green",
    margin: "auto",
  },

  activeBtn: {
    backgroundColor: "green",
  },
});
