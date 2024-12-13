import { Game } from "@/types/game.types";
import { StorageError, StorageGetResult } from "@/types/storage.types";
import { store, get, remove } from "@/utils/storage";

const GAME_KEY = "gameProgress";

export async function saveGame(gameToSave: Game) {
  return await store(GAME_KEY, gameToSave);
}

export async function loadGame(): Promise<StorageGetResult<Game>> {
  const result = await get<Game>(GAME_KEY);
  if (!result.success) {
    return result;
  }

  if (!result.data) {
    await clearGame();
    return { success: false, error: StorageError.STORAGE_KEY_NOT_FOUND };
  }

  return result;
}

export async function clearGame() {
  await remove(GAME_KEY);
}
