import { Difficulty } from "@/models/question";

export function getDifficultyStars(difficulty: Difficulty): string {
  switch (difficulty) {
    case "easy":
      return "★☆☆";
    case "medium":
      return "★★☆";
    case "hard":
      return "★★★";
    default:
      return "☆☆☆";
  }
}
