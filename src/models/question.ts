export type Question = {
  id: number;
  category: Category;
  type: string;
  difficulty: string;
  question: string;
  shuffledChoices: string[];
  correct_answer: string;
  incorrect_answers: string[];
};

export enum Category {
  any = "any",
  general = "9",
  book = "10",
  film = "11",
  music = "12",
  videoGame = "15",
  sport = "21",
  geography = "22",
  history = "23",
}

export enum Difficulty {
  any = "any",
  easy = "easy",
  medium = "medium",
  hard = "hard",
}
