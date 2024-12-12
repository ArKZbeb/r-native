import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { getQuestionsList } from "@/utils/apiQuestions";
import { Category, Difficulty } from "@/models/question";
import { getData, storeData } from "@/utils/storeQuestions";
import { router } from "expo-router";
import { useState } from "react";

export default function GameConfig() {
  const [nbOfQuestion, setnbOfQuestion] = useState(3);

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

  const fetchQuestions = async () => {
    return await getQuestionsList(
      `${nbOfQuestion}`,
      Category.any,
      Difficulty.any
    );
  };

  const startGame = async () => {
    const questions = await fetchQuestions();
    storeData("game", questions);
    router.push(`/questionDetail?inGame=${true}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Configuration de la partie</Text>
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
      <Text style={styles.text}>Category any</Text>
      <Text style={styles.text}> Difficulty any</Text>
      <TouchableOpacity onPress={() => startGame()} style={styles.startGameBtn}>
        <Text style={styles.startGameBtnText}>Commencer la partie</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(20 0 102)",
    paddingVertical: 30,
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 20,
  },

  text: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
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
});
