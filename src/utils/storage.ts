import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/auth.types";

export const storageKeys = {
  USERS: "users",
  CURRENT_USER: "currentUser",
};

export const saveUsers = async (users: User[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(storageKeys.USERS, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users:", error);
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const users = await AsyncStorage.getItem(storageKeys.USERS);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
};

export const saveCurrentUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(storageKeys.CURRENT_USER, JSON.stringify(user));
  } catch (error) {
    console.error("Error saving current user:", error);
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = await AsyncStorage.getItem(storageKeys.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};
