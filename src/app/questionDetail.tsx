import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { clearGame, loadGame, saveGame } from "@/utils/game-manager";
import { Game, GameType } from "@/types/game.types";
import { getDifficultyStars } from "@/utils/questions";
import { addGameToHistory } from "@/utils/gameHistory";
import { GameHistory } from "@/models/gameHistory";
import { useAuth } from "@/context/AuthContext";
import { difficultyValue } from "@/utils/dificultyValue";

export default function QuestionDetail() {
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (game?.type === GameType.QUIZ) {
      const handleBackPress = () => {
        Alert.alert(
          "Quitter la partie",
          "Voulez-vous vraiment quitter la partie en cours ?",
          [
            {
              text: "Annuler",
              style: "cancel",
            },
            {
              text: "Quitter",
              style: "destructive",
              onPress: async () => {
                await clearGame();
                router.back();
              },
            },
          ]
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );

      return () => backHandler.remove();
    }
  }, [game]);

  useEffect(() => {
    const checkGame = async () => {
      try {
        const result = await loadGame();
        if (result.success) {
          setGame(result.data);
        } else {
          router.replace("/");
        }
      } catch (error) {
        console.error("Error loading game:", error);
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkGame();
  }, []);

  const { user } = useAuth();

  if (!user) {
    return;
  }

  const saveGameHistory = async () => {
    if (game?.type === GameType.QUIZ) {
      const gameHistory: GameHistory = {
        id: new Date().toISOString(),
        userId: user.id,
        date: new Date().toLocaleString(),
        ...game,
      };
      await addGameToHistory(gameHistory);
    }
  };

  const verifyResponse = async (choice: string) => {
    if (game && !game.currentQuestion.isAnswered) {
      if (game.type === GameType.QUIZ) {
        game.questionSelections.push(choice);

        const currentQuestion = game.questions[game.currentQuestion.index];
        const isCorrect = currentQuestion.correct_answer === choice;

        if (isCorrect) {
          game.score += 1;
          user?.addExp(2 * difficultyValue(currentQuestion.difficulty));
        }
      }

      const updatedGame: Game = {
        ...game,
        currentQuestion: {
          ...game.currentQuestion,
          isAnswered: true,
          selectedChoice: choice,
        },
      };

      await saveGame(updatedGame);
      setGame(updatedGame);
    }
  };

  const nextQuestion = async () => {
    if (!game) return;

    const nextIndex = game.currentQuestion.index + 1;
    if (nextIndex < game.questions.length) {
      const updatedGame: Game = {
        ...game,
        currentQuestion: {
          index: nextIndex,
          isAnswered: false,
          selectedChoice: null,
        },
      };
      await saveGame(updatedGame);
      setGame(updatedGame);
    } else {
      saveGameHistory();
      console.log("Aucune question suivante disponible.");
      await clearGame();
      router.replace("/");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.bg, styles.centered]}>
        <ActivityIndicator size="large" color="white" />
      </SafeAreaView>
    );
  }

  if (!game || !game.questions || !game.currentQuestion) {
    return null;
  }

  const currentQuestion = game.questions[game.currentQuestion.index];

  return (
    <SafeAreaView style={styles.bg}>
      {game.type == GameType.QUIZ && (
        <>
          <Text style={styles.text}>
            Question {game.currentQuestion.index + 1}/{game.questions.length}
          </Text>
          <Text style={styles.score}>
            Score: {`${game.score} / ${game.questions.length}`}
          </Text>
        </>
      )}
      <Text style={styles.question}>{currentQuestion.question}</Text>
      <Text style={styles.category}>
        {currentQuestion.category.toUpperCase()}
      </Text>
      <Text style={styles.difficulty}>
        {getDifficultyStars(currentQuestion.difficulty)}
      </Text>
      <View style={styles.container}>
        {currentQuestion.shuffledChoices.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.item,
              item === currentQuestion.correct_answer &&
              game.currentQuestion.isAnswered
                ? styles.correctChoice
                : game.currentQuestion.selectedChoice === item
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
        {game.currentQuestion.isAnswered
          ? `la réponse était "${currentQuestion.correct_answer}"`
          : ""}
      </Text>

      {game.type == GameType.QUIZ && game.currentQuestion.isAnswered && (
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  question: {
    textAlign: "center",
    marginHorizontal: 10,
    fontSize: 24,
    color: "white",
  },
  score: {
    color: "white",
    textAlign: "center",
  },
  difficulty: {
    color: "white",
    textAlign: "center",
  },
  category: {
    textAlign: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
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
    backgroundColor: "green",
  },
  incorrectChoice: {
    backgroundColor: "red",
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
