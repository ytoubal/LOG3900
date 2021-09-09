import { Injectable } from "@angular/core";
import { IGame } from "../../../../../server/app/interfaces/IGame";
import { IDrawingInfo } from "../../../../../server/app/interfaces/IDrawingInfo";
import { AuthentificationService } from "../authentification/authentification.service";
import { difficulties } from "../../const/difficulties";
import {
  PlayerStates,
  TeamsState,
  PlayerPosition,
  GameStates,
  TeamPosition,
} from "../../../../../server/app/enums/gameEnums";
import { allHuman } from "src/app/const/roundStates";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { SocketService } from "../socket/socket.service";
import { DATABASE_URL } from "src/app/const/database-url";
import { LobbyService } from "../lobby/lobby.service";
import { WordImageService } from "../wordImage/wordImage.service";
import { Observable, Subject } from "rxjs";
import { IMessageContent } from "../../../../../server/app/interfaces/IMessageContent";
import { AUDIO_SRC } from "src/app/enum/audioSrc";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "my-auth-token",
  }),
};

@Injectable({
  providedIn: "root",
})
export class GameService {
  game: IGame;
  currentDrawing: IDrawingInfo;

  username: string;
  difficulty: string;
  botMsg: Subject<IMessageContent> = new Subject<IMessageContent>();

  currentRound: number;
  teamPos: number;
  guessLimit: number;
  guessCount: number = 0;
  hintCount: number;

  wantsHint: boolean;
  isDrawing: boolean;
  isGuessed: boolean = false;
  activeTeam: boolean;
  isReply: boolean = false;
  hasGuessed: boolean;

  currentAction: PlayerStates;
  teamStates: TeamsState;
  currentTeam: TeamPosition;
  scores: Array<number> = [0, 0];
  roundEnd: any;
  roundStart: any;

  audio: HTMLMediaElement = new Audio();

  constructor(
    private authService: AuthentificationService,
    public http: HttpClient,
    private socketService: SocketService,
    private lobbyService: LobbyService,
    public wordImageService: WordImageService
  ) {
    this.username = this.authService.username;
    this.currentDrawing = this.getDrawingInfo();
  }

  getGame() {
    this.guessLimit = this.getGuessLimit();
    this.teamPos = this.lobbyService.position;
    this.guessLimit = this.getGuessLimit();
    const rolesMap = new Map<string, PlayerStates>();
    const playersMap = new Map<string, PlayerPosition>();
    for (let player of this.lobbyService.team) {
      rolesMap.set(player.username, player.state);
      playersMap.set(player.username, player.position);
    }

    if (
      this.activeTeam &&
      this.getAction(this.teamPos, this.teamStates) ===
        PlayerStates.HumanDrawing
    )
      this.isDrawing = true;
    else this.isDrawing = false;
    // return gameServer;
  }

  updateAction() {
    if (this.activeTeam) {
      this.teamPos = (this.teamPos + 1) % 2;
    }
    if (this.currentAction === PlayerStates.HumanWatching) {
      this.activeTeam = true;
      this.currentAction = this.getAction(this.teamPos, this.teamStates);
      this.isDrawing = this.currentAction === PlayerStates.HumanDrawing;
    } else {
      this.isDrawing = false;
      this.activeTeam = false;
      this.currentAction = PlayerStates.HumanWatching;
    }
  }

  getDrawingInfo() {
    //server.get
    const imageToDraw = {
      artistUsername: "somebody",
      wordToDraw: "apple",
      difficulty: difficulties[1],
    } as IDrawingInfo;
    return imageToDraw;
  }

  getTime() {
    switch (this.difficulty) {
      case "Easy":
        return 70;
      case "Medium":
        return 50;
      case "Hard":
        return 30;
    }
  }

  getGuessLimit() {
    switch (this.difficulty) {
      case "Easy":
        return 10;
      case "Medium":
        return 6;
      case "Hard":
        return 3;
    }
  }

  getAction(pos: PlayerPosition, teamState: TeamsState): PlayerStates {
    switch (teamState) {
      case TeamsState.AllHuman:
        return allHuman[pos];
      case TeamsState.WithRobot:
        return PlayerStates.HumanGuessing;
    }
  }

  setReplier(): void {
    if (this.currentAction === PlayerStates.HumanWatching) {
      this.currentAction = PlayerStates.HumanReplying;
      this.activeTeam = true;
    } else {
      this.currentAction = PlayerStates.HumanWatching;
      this.activeTeam = false;
    }
  }

  guessWord(wordGuess: string): void {
    this.guessCount++;
    if (
      !this.isDrawing &&
      this.activeTeam &&
      this.guessCount <= this.guessLimit &&
      !this.isReply
    ) {
      if (
        wordGuess.toLocaleUpperCase() ===
        this.wordImageService.currentWords[this.currentRound - 1].toUpperCase()
      ) {

        this.hasGuessed = true;
        this.socketService.socket.emit(
          "guess-word",
          JSON.stringify({
            name: this.lobbyService.name,
            team: this.currentTeam,
            guesser: this.username,
          })
        );
        if (this.teamStates == TeamsState.WithRobot) {
          this.socketService.socket.emit("stop-word", this.lobbyService.name);
        }
      } else if (this.guessCount === this.guessLimit) {
        this.hasGuessed = false;
        this.socketService.socket.emit("reply", this.lobbyService.name);
      }
    } else if (this.activeTeam && this.isReply) {
      if (
        wordGuess.toLocaleUpperCase() ===
        this.wordImageService.currentWords[this.currentRound - 1].toUpperCase()
      ) {
        this.hasGuessed = true;
        this.socketService.socket.emit(
          "guess-word",
          JSON.stringify({
            name: this.lobbyService.name,
            team: this.currentTeam,
            guesser: this.username,
          })
        );
        if (this.teamStates == TeamsState.WithRobot) {
          this.socketService.socket.emit("stop-word", this.lobbyService.name);
        }
      } else {
        this.hasGuessed = false;
        this.socketService.socket.emit("round-end", this.lobbyService.name);
        this.roundStart = setTimeout(() => {
          this.socketService.socket.emit("round-start", this.lobbyService.name);
        }, 5000);
      }
    }
  }

  emitBotMessageEvent(msg: IMessageContent): void {
    this.botMsg.next(msg);
  }

  botMsgListener(): Observable<IMessageContent> {
    return this.botMsg.asObservable();
  }

  emitBotMsg(state: number) {
    if (this.teamStates === TeamsState.WithRobot) {
      const botName = this.lobbyService.team[
        (this.lobbyService.position + 1) % 2
      ].username;
      this.socketService.socket.emit(
        "bot-msg",
        JSON.stringify({
          state: state,
          sender: botName,
          lobbyName: this.lobbyService.name,
        })
      );
    }
  }

  playAudio(source: string): void {
    let isPlaying =
      this.audio.currentTime > 0 && !this.audio.paused && !this.audio.ended;

    if (isPlaying) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }

    this.audio.src = source;
    this.audio.load();

    source == AUDIO_SRC.LOST ? this.audio.volume = 0.04 : this.audio.volume = 0.10;
    this.audio.play();
  }

  getHint(hint: string): void {
    const botName = this.lobbyService.team[(this.lobbyService.position + 1) % 2]
      .username;
    const msg = {
      message: hint,
      sender: botName,
      timestamp:
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
      room: this.lobbyService.name,
      avatar: "virtual_player",
    } as IMessageContent;
    this.emitBotMessageEvent(msg);
  }

  sendTutorialGuess(): void {
    const msg = {
      message: "Apple",
      sender: "Yanis",
      timestamp:
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
      room: "tutorial",
      avatar: "avatar6",
    } as IMessageContent;
    this.emitBotMessageEvent(msg);
  }

  async insertGame(game: any): Promise<any> {
    return this.http
      .post<any>(DATABASE_URL + "/database/insert-game", game, httpOptions)
      .toPromise();
  }

  // getBotMsg(name: string, state: number): string {
  //   let randomMsg = Math.floor(Math.random() * 3); //3 messages in each array
  //   switch (name) {
  //     case 'Botliver':
  //       return niceBot[state][randomMsg]
  //     case 'YanisBot':
  //       return angryBot[state][randomMsg]
  //     case 'NhienBot':
  //       return funnyBot[state][randomMsg]
  //     case 'Botlice':
  //       return niceBot[state][randomMsg]
  //     case 'YuhanBot':
  //       return arrogantBot[state][randomMsg]
  //     case 'CharlesBot':
  //       return intellectualBot[state][randomMsg]

  //   }
  // }

  async getGameByHost() {
    const params = new HttpParams().set("host", this.username); // Create new HttpParams
    return this.http
      .get(DATABASE_URL + "/database/game-host", { params })
      .toPromise();
  }
}
