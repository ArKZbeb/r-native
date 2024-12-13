import { useAuth } from "@/context/AuthContext";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ExperienceProgressBarProps {
  expTotal: number;
}

export const ExperienceProgressBar: React.FC<ExperienceProgressBarProps> = ({
  expTotal,
}) => {
  const { user } = useAuth();
  // Vérifiez que l'utilisateur et les méthodes existent
  const currentLevel = user?.getLevel(user.expTotal) || 0;
  const percentageToNextLevel =
    user?.getPercentageToNextLevel(user.expTotal) || 0;

  return (
    <View style={styles.container}>
      <View style={styles.levelContainer}>
        <Text style={styles.levelText}>Niveau {currentLevel}</Text>
        <Text style={styles.expText}>{expTotal % 20} XP</Text>
      </View>

      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${Math.min(percentageToNextLevel, 100)}%`,
            },
          ]}
        />
      </View>

      <Text style={styles.progressText}>
        {percentageToNextLevel.toFixed(0)}% vers le niveau suivant
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  levelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  levelText: {
    color: "whitesmoke",
    fontSize: 16,
    fontWeight: "bold",
  },
  expText: {
    color: "whitesmoke",
    fontSize: 14,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4CAF50", // Vert vif pour la progression
  },
  progressText: {
    color: "whitesmoke",
    textAlign: "center",
    marginTop: 5,
    fontSize: 12,
  },
});
