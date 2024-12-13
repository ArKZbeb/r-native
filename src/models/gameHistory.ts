import { Game, GameType } from "@/types/game.types";

export type GameHistory = {
  id: string;
  userId: string;
  date: string;
} & Game & {
    type: GameType.QUIZ;
  };
