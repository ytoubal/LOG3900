export interface IUserInfo {
  //public

  public: {
    username: string;
    avatar: string; // ENUM for avatar?
    pointsXP: number;
    album: [];
    title?: string;
    border?: string;
  };

  private: {
    firstName: string;
    lastName: string;
    gameStats: IGameStats;
    connections: [];
  };

  connection: {
    username: string;
    password: string;
    socketId: string;
    isConnected: boolean;
    rooms: string[];
  };

  // connnections: string[]; // connections timeStamps [S]

  //level : number;   [s]

  // gameHistory: IGameHistory[];    // [s]
}

export interface IGameStats {
  gamesPlayed: number;
  gamesWon: number;
  totalGameTime: number;
  allGames: IGameHistory[];

  // soloBestScore : number; // [s]
}

export interface IGameHistory {
  date: string;
  time: number;
  gameMode: GameMode;
  scoreClassic: number[];
  usersPlayedWith: any[];
  difficulty: string
}

export enum GameMode {
  CLASSIC,
  SOLO,
}

export interface IUserUpdate {
  username: string;
  field: string;
  newValue: string | number | IGameStats;
}
