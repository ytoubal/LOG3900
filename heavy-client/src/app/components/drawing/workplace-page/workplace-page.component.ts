import {
  Component,
  HostListener,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { I18nPluralPipe } from "@angular/common";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { profilePics } from "src/app/const/profile-pics";
import { AuthentificationService } from "src/app/services/authentification/authentification.service";
import { GameService } from "src/app/services/game/game-service.service";
import { LobbyService } from "src/app/services/lobby/lobby.service";
import { SocketService } from "src/app/services/socket/socket.service";
import { ITool } from "../tool-interface/tool";
import { CanvasComponent } from "./../canvas/canvas.component";
import { EndGameDialogComponent } from "./end-game-dialog/end-game-dialog.component";
import { NgxSpinnerService } from "ngx-spinner";
import { WordImageService } from "src/app/services/wordImage/wordImage.service";
import {
  PlayerStates,
  TeamsState,
} from "../../../../../../server/app/enums/gameEnums";
import { SaveDrawingService } from "src/app/services/drawing/save-drawing.service";
import { IGame } from "../../../../../../server/app/interfaces/IGame";
import { MessageType } from "src/app/enum/botMsgType";
import { AUDIO_SRC } from "src/app/enum/audioSrc";
import { ExportService } from "src/app/services/drawing/export.service";
import { SnackbarService } from "src/app/services/snackbar/snackbar.service";
import { ThemeService } from "src/app/services/theme/theme.service";
import { Levels } from "src/app/const/levels";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-workplace-page",
  templateUrl: "./workplace-page.component.html",
  styleUrls: ["./workplace-page.component.scss"],
})
export class WorkplacePageComponent implements OnInit {
  @ViewChild("panel", { static: false }) panel: HTMLElement;
  @ViewChild("toolbar", { static: false }) toolbar: HTMLElement;
  @ViewChild("workspace", { static: false }) workspace: HTMLElement;

  canvas: CanvasComponent;
  tools: ITool;
  innerWidth: number;
  innerHeight: number;
  timeLeft: number;
  timerRef: number;

  min: string;
  sec: string;
  word: string;
  successMsg: string;

  isDrawing: boolean;
  words: string[] = [];

  pluralMapping: any = {
    "=0": "game.point.s",
    "=1": "game.point.s",
    other: "game.point.p",
  };

  engPluralMapping: any = {
    "=0": "game.point.p",
    "=1": "game.point.s",
    other: "game.point.p",
  };

  startTime;
  endTime;
  // currentWords: string[] = [];

  // tslint:disable-next-line: no-empty
  constructor(
    public router: Router,
    public lobbyService: LobbyService,
    public gameService: GameService,
    public themeService: ThemeService,
    private socketService: SocketService,
    private dialog: MatDialog,
    private authService: AuthentificationService,
    private spinner: NgxSpinnerService,
    private wordImageService: WordImageService,
    private saveDrawingService: SaveDrawingService,
    private exportService: ExportService,
    private snackbar: SnackbarService,
    public translate: TranslateService
  ) {
    this.gameService.difficulty = this.lobbyService.difficulty;
    this.gameService.currentRound = 1;
    this.gameService.hintCount = this.wordImageService.currentHints[
      this.gameService.currentRound - 1
    ].length;
    this.gameService.getGame();
    this.isDrawing = gameService.isDrawing;
  }

  ngOnInit(): void {
    this.themeService.toggle();
    this.startTime = new Date();
    // this.tools = tools;
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    // this.socketService.setUpSocketConnection();
    this.showSpinner();

    setTimeout(() => {
      this.gameService.emitBotMsg(MessageType.GameStart);
    }, 5000);

    if (this.authService.username === this.lobbyService.owner) {
      setTimeout(() => {
        this.socketService.socket.emit("round-start", this.lobbyService.name);
      }, 5000);
    }

    this.socketService.socket.on("bot-msg", (botMsg: any) => {
      this.gameService.emitBotMessageEvent(botMsg);
    });

    this.socketService.socket.on("round-start", () => {
      if (
        this.gameService.activeTeam &&
        this.gameService.teamStates == TeamsState.WithRobot
      ) {
        const wordImage = {
          word: this.wordImageService.currentWords[
            this.gameService.currentRound - 1
          ],
          game: this.lobbyService.name,
        };
        this.socketService.socket.emit("word-image", JSON.stringify(wordImage));
      }

      this.timeLeft = this.gameService.getTime();
      this.setTimer();
      this.gameService.isGuessed = false;
      this.isDrawing = this.gameService.isDrawing;
      this.word = this.showWord();
    });

    this.socketService.socket.on("round-end", () => {
      if (this.gameService.activeTeam && this.gameService.isDrawing || this.gameService.isReply && this.gameService.isDrawing) {
        this.saveDrawingService.saveCurrentDrawing(
          this.wordImageService.currentWords[this.gameService.currentRound - 1]
        );
      }
      let state = this.gameService.hasGuessed
        ? MessageType.RightGuess
        : MessageType.WrongGuess;
      this.gameService.emitBotMsg(state);
      this.gameService.hasGuessed = false;
      this.gameService.guessCount = 0;
      console.log("round-end");
      if (this.timerRef) window.clearInterval(this.timerRef);
      if (this.gameService.isReply) {
        this.gameService.isReply = false;
        this.gameService.activeTeam = !this.gameService.activeTeam;
      }
      this.gameService.updateAction();
      this.updateRound();
      this.gameService.currentRound++;
      if (
        this.wordImageService.currentHints[this.gameService.currentRound - 1]
      ) {
        this.gameService.hintCount = this.wordImageService.currentHints[
          this.gameService.currentRound - 1
        ].length;
      }
    });

    this.socketService.socket.on("game-end", () => {
      this.endTime = new Date();
      let time = Math.ceil((this.endTime - this.startTime) / 1000);
      console.log("game-end");
      this.gameService.currentRound--;
      this.gameService.hintCount = 0;
      let win =
        this.gameService.scores[this.gameService.currentTeam] >
        this.gameService.scores[(this.gameService.currentTeam + 1) % 2]
          ? 1
          : 0;

      const game = {
        username: this.authService.username,
        nbVictories: win,
        time,
        users: this.lobbyService.players,
        score: this.gameService.scores,
        mode: "Classique",
        diff: this.gameService.difficulty,
      };

      if (win) {
        switch (this.gameService.difficulty) {
          case "Easy":
            this.authService.pointsXP += 50;
            break;
          case "Medium":
            this.authService.pointsXP += 75;
            break;
          case "Hard":
            this.authService.pointsXP += 100;
            break;
        }
      }

      this.socketService.socket.emit("game-info", JSON.stringify(game));
      // if (this.authService.username === this.lobbyService.owner) {
      //   this.socketService.socket.emit("delete-lobby", this.lobbyService.name);
      // }
      this.socketService.socket.off("round-end");
      this.socketService.socket.off("round-start");
      this.socketService.socket.off("game-start");
      this.socketService.socket.off("game-end");
      this.socketService.socket.off("bot-msg");
      this.socketService.socket.off("word-image");
      this.socketService.socket.off("stop-game");
      this.socketService.socket.off("stop-word");
      // this.socketService.socket.disconnect();
    });

    this.socketService.socket.on("stop-game", () => {
      console.log("stop game, someone has been disconnected");
      this.gameService.audio.pause();
      if (this.timerRef) window.clearInterval(this.timerRef);
      this.gameService.scores = [0, 0];
      this.saveDrawingService.savedDrawings = [];
      this.saveDrawingService.savedWords = [];
      this.saveDrawingService.savedBool = [];
      this.socketService.socket.emit("stop-word", this.lobbyService.name);
      this.socketService.socket.disconnect();
      this.snackbar.openSnackBar("A user has disconnected.", "Close");
      this.router.navigateByUrl("/menu");
    });

    this.socketService.socket.on("guess-word", (data: any) => {
      this.successMsg = data.guesser + " GUESSED IT";
      this.gameService.isGuessed = true;
      console.log("guess-word");
      clearTimeout(this.gameService.roundEnd);
      clearTimeout(this.gameService.roundStart);
      if (
        this.gameService.activeTeam &&
        !this.gameService.isDrawing &&
        this.gameService.hasGuessed
      ) {
        this.socketService.socket.emit("round-end", this.lobbyService.name);
        this.gameService.roundStart = setTimeout(() => {
          this.socketService.socket.emit("round-start", this.lobbyService.name);
        }, 5000);
      }
      this.gameService.scores[data.team] += 1;
    });

    this.socketService.socket.on("reply", () => {
      if (this.timerRef) window.clearInterval(this.timerRef);

      if (
        this.gameService.teamStates == TeamsState.WithRobot &&
        this.gameService.activeTeam &&
        !this.gameService.isDrawing
      ) {
        this.socketService.socket.emit("stop-word", this.lobbyService.name);
      }

      clearTimeout(this.gameService.roundStart);
      clearTimeout(this.gameService.roundEnd);
      this.gameService.roundStart = setTimeout(() => {
        this.gameService.isReply = true;
        this.timeLeft = 10; //10sec
        this.setTimer();
        this.gameService.isGuessed = false;
        this.isDrawing = this.gameService.isDrawing;
        this.word = this.showWord();
        this.gameService.activeTeam = !this.gameService.activeTeam;
      }, 3000);
    });

  }

  @HostListener("window:resize", ["$event"])
  onResize(event: UIEvent): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }

  setTimer() {
    this.timerRef = window.setInterval(() => {
      this.timeLeft--;

      this.sec =
        this.timeLeft % 60 < 10
          ? "0" + (this.timeLeft % 60).toString()
          : (this.timeLeft % 60).toString();

      this.min =
        Math.floor(this.timeLeft / 60) < 10
          ? "0" + Math.floor(this.timeLeft / 60).toString()
          : Math.floor(this.timeLeft / 60).toString();

      if (this.timeLeft == 10) this.playAudio(AUDIO_SRC.TEN_SEC);

      if (this.timeLeft == 0) {
        if (this.gameService.isReply) {
          this.gameService.isReply = false;
          this.gameService.activeTeam = !this.gameService.activeTeam;
          if (
            (this.lobbyService.position == 0 ||
              this.gameService.teamStates == TeamsState.WithRobot) &&
            !this.gameService.activeTeam
          ) {
            this.socketService.socket.emit("round-end", this.lobbyService.name);
            this.gameService.roundStart = setTimeout(() => {
              this.socketService.socket.emit(
                "round-start",
                this.lobbyService.name
              );
            }, 5000);
          }
        } else if (!this.gameService.isDrawing && this.gameService.activeTeam) {
          this.socketService.socket.emit("reply", this.lobbyService.name);
        }
      }
    }, 1000);
  }

  showSpinner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }

  askHint() {
    if (
      this.gameService.hintCount > 0 &&
      !this.gameService.isDrawing &&
      this.gameService.activeTeam &&
      !this.gameService.isGuessed &&
      this.gameService.teamStates == TeamsState.WithRobot
    ) {
      const hintNb = this.wordImageService.currentHints[
        this.gameService.currentRound - 1
      ].length;
      this.gameService.getHint(
        this.wordImageService.currentHints[this.gameService.currentRound - 1][
          hintNb - this.gameService.hintCount
        ]
      );
      this.gameService.hintCount--;
    }
  }

  getPlayerActionEnum(action: string) {
    switch (action) {
      case "humanDraw":
        return PlayerStates.HumanDrawing;
      case "humanGuess":
        return PlayerStates.HumanGuessing;
    }
  }

  getTeamState(state: string) {
    switch (state) {
      case "h":
        return TeamsState.AllHuman;
      case "r":
        return TeamsState.WithRobot;
    }
  }

  updateRound() {
    if (this.gameService.currentRound === this.lobbyService.rounds) {
      this.socketService.socket.off("round-start");
      this.socketService.socket.off("round-end");
      if (this.authService.username === this.lobbyService.owner) {
        this.socketService.socket.emit("game-end", this.lobbyService.name);
      }

      //to do: clear chat for next round

      const endDialog = this.dialog.open(EndGameDialogComponent, {
        disableClose: true,
        width: "400px",
        // height: "500px",
        // data: { score: game scores }
      });
      endDialog.afterClosed().subscribe((result) => {
        this.router.navigateByUrl("/menu");
        this.gameService.guessCount = 0;
      });
    } else {
      this.showSpinner();
    }
  }

  // 10 sec left tiktok
  playAudio(source: string): void {
    let audio = new Audio();
    audio.src = source;
    audio.load();
    audio.volume = 0.25;
    audio.play();
  }

  showWord() {
    console.log(
      this.wordImageService.currentWords[this.gameService.currentRound - 1]
    );
    if (!this.gameService.isDrawing) {
      let wordHint = "";
      for (
        let i = 0;
        i <
        this.wordImageService.currentWords[this.gameService.currentRound - 1]
          .length;
        i++
      ) {
        wordHint += "_ ";
      }
      return wordHint.trim();
    }
    return this.wordImageService.currentWords[
      this.gameService.currentRound - 1
    ].toUpperCase();
  }

  goMenu() {
    this.socketService.socket.emit("stop-game", this.lobbyService.name);
  }

  addGame() {


    // MAP TO STRING ARRAY
    const mapToObj = (m) => {
      return Array.from(m).reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
    };

    this.gameService
      .insertGame(JSON.stringify(this.gameService.game))
      .then((data) => {
        console.log(data);
      });
  }

  getGame() {
    this.gameService.getGameByHost().then((data) => {
      console.log(JSON.parse(JSON.stringify(data)));
    });
  }

  findImgSrc(name: string): string {
    return profilePics.find((o) => o.name === name).src;
  }
}
