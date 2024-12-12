export class User {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public profilePhoto: string | null,
    public expTotal: number
  ) {}

  getLevel() {
    const maxLevel = 20;
    let level = 0;
    while (this.expTotal > 20 || level === maxLevel) {
      level += 1;
      this.expTotal -= 20;
    }
    return level;
  }

  getPercentageToNextLevel() {
    const level = this.getLevel();
    if (level === 20) {
      return 0;
    }
    return ((this.expTotal % 20) * 100) / 20;
  }
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}
