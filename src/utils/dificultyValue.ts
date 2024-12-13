// renvoie la valeur de la difficulté en fonction de la difficulté de questions "★☆☆", "★★☆", ou "★★★" donc renvoie 1, 2 ou 3 en number

export const difficultyValue = (difficulty: string): number => {
  switch (difficulty) {
    case "easy":
    case "★☆☆":
      return 1;
    case "medium":
    case "★★☆":
      return 2;
    case "hard":
    case "★★★":
      return 3;
    default:
      return 0;
  }
};
