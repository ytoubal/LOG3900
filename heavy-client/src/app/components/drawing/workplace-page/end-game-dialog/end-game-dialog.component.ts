import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { AuthentificationService } from "src/app/services/authentification/authentification.service";
import { SaveDrawingService } from "src/app/services/drawing/save-drawing.service";
import { GameService } from "src/app/services/game/game-service.service";
import { LobbyService } from "src/app/services/lobby/lobby.service";
import { SocketService } from "src/app/services/socket/socket.service";
import * as confetti from "canvas-confetti";
import { AUDIO_SRC } from "src/app/enum/audioSrc";
import { ThemeService } from "src/app/services/theme/theme.service";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-end-game-dialog",
  templateUrl: "./end-game-dialog.component.html",
  styleUrls: ["./end-game-dialog.component.scss"],
})
export class EndGameDialogComponent implements OnInit {
  teamWon: boolean;
  tie: boolean;
  teamPos: number;

  confettiDuration = 5 * 1000;
  animationEnd = Date.now() + this.confettiDuration;
  // default = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  interval: number;

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

  constructor(
    public dialogRef: MatDialogRef<EndGameDialogComponent>,
    public gameService: GameService,
    private socketService: SocketService,
    private lobbyService: LobbyService,
    private authService: AuthentificationService,
    public saveDrawingService: SaveDrawingService,
    public themeService: ThemeService,
    private router: Router,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.teamPos = this.gameService.currentTeam; //hardcoded
    this.setWinningTeam();
    this.throwConfetti();
    this.teamWon
      ? this.gameService.playAudio(AUDIO_SRC.WIN)
      : this.gameService.playAudio(AUDIO_SRC.LOST);
    this.themeService.toggle();
  }

  setWinningTeam(): void {
    const otherTeam = (this.teamPos + 1) % 2;
    if (
      this.gameService.scores[this.teamPos] ==
      this.gameService.scores[otherTeam]
    ) {
      this.tie = true;
      this.teamWon = false;
    } else {
      this.tie = false;
      this.teamWon =
        this.gameService.scores[this.teamPos] >
        this.gameService.scores[otherTeam]
          ? true
          : false;
    }
  }

  random(min, max) {
    return Math.random() * (max - min) + min;
  }

  throwConfetti(): void {
    if (this.teamWon) {
      this.interval = window.setInterval(() => {
        let timeLeft = this.animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(this.interval);
        }
        confetti.create(undefined, { resize: true })({
          particleCount: 50 * (timeLeft / this.confettiDuration),
          startVelocity: 40,
          ticks: 60,
          spread: 360,
          zIndex: 999,
          angle: 60,
          origin: { x: this.random(0, 0.3), y: Math.random() - 0.2 },
        });
        confetti.create(undefined, { resize: true })({
          particleCount: 50 * (timeLeft / this.confettiDuration),
          startVelocity: 40,
          ticks: 60,
          spread: 360,
          zIndex: 999,
          angle: 60,
          origin: { x: this.random(0.7, 1), y: Math.random() - 0.2 },
        });
      }, 250);
    }
  }

  closeDialog() {
    this.dialogRef.close();
    this.gameService.audio.pause();
    this.gameService.scores = [0, 0];
    this.saveDrawingService.savedDrawings = [];
    this.saveDrawingService.savedWords = [];
    this.saveDrawingService.savedBool = [];
    this.socketService.socket.disconnect();
    this.router.navigateByUrl("/menu");
  }
}
