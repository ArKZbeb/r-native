import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuestionDetail() {
  const { data } = useLocalSearchParams();

  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [correctChoice, setCorrectChoice] = useState<string | null>(null);

  const question =
    data && typeof data === "string"
      ? JSON.parse(decodeURIComponent(data))
      : null;

  const [choices, setChoices] = useState([]);

  const verifyResponse = (item: string) => {
    if (!isAnswered) {
      setIsAnswered(true);
      setSelectedChoice(item);

      if (item == question.correct_answer) {
        setCorrectChoice(item);
      } else {
        setCorrectChoice(question.correct_answer);
      }
    }
  };

  useEffect(() => {
    setChoices(question.shuffledChoices);
    
  }, []);

  return (
    <SafeAreaView style={styles.bg}>
      {question ? (
        <>
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
            {isAnswered ? `la réponse était "${question.correct_answer}"`: ''}
          </Text>
          </>
      ) : (
        <Text>Aucune donnée disponible</Text>
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
  textResponse:{
    color: 'white',
    textAlign: 'center',
    fontSize: 24
  }
});
