import { Question } from "../models/question";

export enum GameType {
  SINGLE,
  QUIZ,
}

export interface CurrentQuestion {
  index: number;
  isAnswered: boolean;
  selectedChoice: string | null;
}

export type Game =
  | {
      type: GameType.SINGLE;
      questions: [Question];
      questionSelections: [] | [string];
      currentQuestion: CurrentQuestion;
    }
  | {
      type: GameType.QUIZ;
      questions: Question[];
      questionSelections: string[];
      currentQuestion: CurrentQuestion;
    };
