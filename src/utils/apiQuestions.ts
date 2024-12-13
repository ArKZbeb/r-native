import { Category, Difficulty, Question } from "../models/question";

export const getQuestionsList = async (
  nbOfQuestion: string,
  category: Category,
  difficulty: Difficulty
): Promise<Question[]> => {
  const retryDelay = 1000;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=${nbOfQuestion}` +
          (category !== "any" ? `&category=${category}` : "") +
          (difficulty !== "any" ? `&difficulty=${difficulty}` : "")
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }

      const result = await response.json();
      const formattedItems = result.results.map((item: any, index: number) => {
        const allChoices = [item.correct_answer, ...item.incorrect_answers];
        const shuffled = arrayShuffle(allChoices.map(decodeHtmlEntities));
        return {
          ...item,
          question: decodeHtmlEntities(item.question),
          correct_answer: decodeHtmlEntities(item.correct_answer),
          incorrect_answers: item.incorrect_answers.map(decodeHtmlEntities),
          category: decodeHtmlEntities(item.category),
          shuffledChoices: shuffled,
          id: index + 1,
        };
      });

      return formattedItems;
    } catch (error) {
      console.log(`Tentative ${attempt} échouée`, error);

      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  console.error(
    "Échec de la récupération des données après plusieurs tentatives"
  );
  return [];
};
const arrayShuffle = (a: string[]): string[] => {
  let l = a.length,
    t,
    r;
  while (l !== 0) {
    r = Math.floor(Math.random() * l);
    l -= 1;
    t = a[l];
    a[l] = a[r];
    a[r] = t;
  }
  return a;
};

const decodeHtmlEntities = (text: string): string => {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&Uuml;/g, "Ü");
};
