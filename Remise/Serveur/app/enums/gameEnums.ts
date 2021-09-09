export enum PlayerStates {
    HumanDrawing = 'humanDraw',
    HumanGuessing = 'humanGuess',
    HumanWatching = 'humanWatch',
    HumanReplying = 'humanReply',
    RobotDrawing = 'robotDraw',
    RobotGuessing = 'robotGuess',
};

export enum TeamsState {
    AllHuman = 'h',
    WithRobot = 'r'
};

export enum PlayerPosition {
    firstMember = 0,
    secondMember = 1
};

export enum TeamPosition {
    teamA = 0,
    teamB = 1
};

export enum GameStates {
    GameStart = 'gameStart',
    RoundStart = 'startRound',
    RoundEnd = 'endRound',
    GameEnd = 'endGame'
};

