import { Question } from "@/models/question";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key: string, value: Question[] | Question) => {
  if (!value) {
    return console.log("erreur donnée vide");
  } else {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log(`${key} et ${AsyncStorage}`);
    } catch (error) {
      console.error("Erreur complète de stockage", error);
    }
  }
};

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      const parsedValue = JSON.parse(value);
      console.log(parsedValue);
      return parsedValue;
    }
    return null;
  } catch (error) {
    console.error("Erreur complète de récupération", error);
    return null;
  }
};
