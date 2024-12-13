import { saveUser, useAuth } from "@/context/AuthContext";
import { GameHistory } from "@/models/gameHistory";
import { addGameToHistory } from "@/utils/gameHistory";
import { difficultyValue } from "@/utils/dificultyValue";
import { getData } from "@/utils/storeQuestions";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuestionDetail() {
  const { inGame } = useLocalSearchParams();
  const [question, setQuestion] = useState<any | null>(null);
  const [questions, setQuestions] = useState<any | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [correctChoice, setCorrectChoice] = useState<string | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const params =
    inGame && typeof inGame === "string"
      ? JSON.parse(decodeURIComponent(inGame))
      : null;

  const verifyResponse = async (item: string) => {
    if (!isAnswered && question) {
      setIsAnswered(true);
      setSelectedChoice(item);
      if (item === question.correct_answer) {
        console.log("Bonne réponse");
        user?.addExp(2 * difficultyValue(question.difficulty));
        if (user) {
          await saveUser(user);
        }
        setScore(score + 1);
        setCorrectChoice(item);
      } else {
        setCorrectChoice(question.correct_answer);
      }
    }
  };
  const { user } = useAuth();

  if (user === null) {
    return;
  }
  const saveGameHistory = async () => {
    const game: GameHistory = {
      id: new Date().toISOString(),
      userId: user.id,
      date: new Date().toLocaleString(),
      score: score,
      questions: questions.map((q: any) => q.question),
    };
    await addGameToHistory(game);
  };

  const fetchQuestions = async () => {
    try {
      const storedQuestions = await getData("game");

      if (Array.isArray(storedQuestions)) {
        setQuestions(storedQuestions);
        const firstQuestion = storedQuestions[0];
        setQuestion(firstQuestion);
        setChoices(firstQuestion.shuffledChoices);
      } else if (storedQuestions && storedQuestions.shuffledChoices) {
        setQuestion(storedQuestions);
        setChoices(storedQuestions.shuffledChoices);
      } else {
        console.error("Format de données invalide");
      }
    } catch (error) {
      console.error("Erreur de récupération des questions", error);
    }
  };

  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (questions && nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      const nextQuestion = questions[nextIndex];
      setQuestion(nextQuestion);
      setChoices(nextQuestion.shuffledChoices);
      setIsAnswered(false); // Réinitialise l'état pour la prochaine question
      setSelectedChoice(null);
      setCorrectChoice(null);
    } else {
      saveGameHistory();
      console.log("Aucune question suivante disponible.");
      router.replace({
        pathname: "/",
      });
    }
  };

  if (!question) {
    return (
      <SafeAreaView style={styles.bg}>
        <Text style={styles.textResponse}>Chargement...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.bg}>
      {params && (
        <Text style={styles.text}>
          Question {currentQuestionIndex + 1}/{questions.length}
        </Text>
      )}
      <Text style={styles.question}>{question.question}</Text>
      <View style={styles.container}>
        {choices.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.item,
              item === correctChoice
                ? styles.correctChoice
                : selectedChoice === item
                  ? styles.incorrectChoice
                  : null,
            ]}
            onPress={() => verifyResponse(item)}
          >
            <Text style={styles.itemText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.textResponse}>
        {isAnswered ? `la réponse était "${question.correct_answer}"` : ""}
      </Text>

      {params && isAnswered && (
        <TouchableOpacity
          onPress={() => nextQuestion()}
          style={styles.startGameBtn}
        >
          <Text style={styles.startGameBtnText}>Suivant</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "rgb(20 0 102)",
    justifyContent: "space-around",
  },

  question: {
    textAlign: "center",
    marginHorizontal: 10,
    fontSize: 24,
    color: "white",
  },

  container: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    paddingHorizontal: 20,
  },

  text: {
    textAlign: "center",
    color: "white",
    fontSize: 24,
  },

  item: {
    backgroundColor: "white",
    height: 65,
    borderRadius: 12,
    display: "flex",
    padding: 10,
  },

  itemText: {
    margin: "auto",
    fontSize: 18,
    color: "rgb(20 0 102)",
    fontWeight: "600",
  },
  correctChoice: {
    backgroundColor: "green", // La bonne réponse en vert
  },
  incorrectChoice: {
    backgroundColor: "red", // La réponse incorrecte en rouge
  },
  textResponse: {
    color: "white",
    textAlign: "center",
    fontSize: 24,
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
