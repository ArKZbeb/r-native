// src/utils/gameHistory.ts
import { GameHistory } from "@/models/gameHistory";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "gameHistory";

export const addGameToHistory = async (game: GameHistory) => {
  try {
    const historyJson = await AsyncStorage.getItem(HISTORY_KEY);
    const history = historyJson ? JSON.parse(historyJson) : {};
    if (!history[game.userId]) {
      history[game.userId] = [];
    }
    history[game.userId].push(game);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'historique de la partie", error);
  }
};

export const getGameHistory = async (userId: string): Promise<GameHistory[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(HISTORY_KEY);
    const history = historyJson ? JSON.parse(historyJson) : {};
    return history[userId] || [];
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique des parties", error);
    return [];
  }
};