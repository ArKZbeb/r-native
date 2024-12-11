export class User {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public profilePhoto: string | null,
    public expTotal: number
  ) {}

  getLevel(expTotal: number) {
    const maxLevel = 20;
    let level = 0;
    while (expTotal > 20 || level === maxLevel) {
      level += 1;
      expTotal -= 20;
    }
    return level;
  }

  getPercentageToNextLevel(expTotal: number) {
    const level = this.getLevel(expTotal);
    if (level === 20) {
      return 0;
    }
    return ((expTotal % 20) * 100) / 20;
  }
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}
