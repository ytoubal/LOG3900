import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { profilePics } from "src/app/const/profile-pics";
import { instructions } from "src/app/const/tutorial";
import { WARNING_TYPE } from "src/app/enum/warningType";
import { AuthentificationService } from "src/app/services/authentification/authentification.service";
import { CanvasService } from "src/app/services/drawing/canvas.service";
import { GameService } from "src/app/services/game/game-service.service";
import { ModalService } from "src/app/services/modal/modal.service";
import { SocketService } from "src/app/services/socket/socket.service";
import { ThemeService } from "src/app/services/theme/theme.service";
import { TutorialService } from "src/app/services/tutorial/tutorial.service";
import {
  PlayerPosition,
  PlayerStates,
  TeamPosition,
} from "../../../../../server/app/enums/gameEnums";
import { CanvasComponent } from "../drawing/canvas/canvas.component";
import { ITool } from "../drawing/tool-interface/tool";

@Component({
  selector: "app-tutorial",
  templateUrl: "./tutorial.component.html",
  styleUrls: ["./tutorial.component.scss"],
})
export class TutorialComponent implements OnInit, AfterViewInit {
  @ViewChild("panel", { static: false }) panel: HTMLElement;
  @ViewChild("toolbar", { static: false }) toolbar: HTMLElement;
  @ViewChild("workspace", { static: false }) workspace: HTMLElement;
  @ViewChild("doc", { static: false }) doc: ElementRef;
  // @ViewChild("top", { static: false }) top: ElementRef;
  // @ViewChild("bottom", { static: false }) bottom: ElementRef;

  canvas: CanvasComponent;
  tools: ITool;
  team1: any[] = [];
  team2: any[] = [];
  path: any;
  svg: any;

  innerWidth: number;
  innerHeight: number;

  score: number = 0;
  totalRounds: number = 3;
  currentRound: number;
  step4Count: number = 0;
  step6Count: number = 0;
  progressValue: number = 0;

  // hints=["fruit", "usually red"]
  instructionText: string;

  constructor(
    private renderer: Renderer2,
    public authService: AuthentificationService,
    private modalService: ModalService,
    private gameService: GameService,
    private socketService: SocketService,
    private router: Router,
    private canvasService: CanvasService,
    public tutorialService: TutorialService,
    public themeService: ThemeService,
    public translate: TranslateService
  ) {
    this.currentRound = 1;
  }

  ngOnInit() {
    this.tutorialService.step = 0;
    this.themeService.toggle();
    this.translateInstruction();
    this.setTeams();
    this.socketService.setUpSocketConnection();
  }

  translateInstruction(): void {
    switch (this.translate.currentLang.toString()) {
      case "en":
        this.instructionText = instructions[0][this.tutorialService.step];
        break;
      case "fr":
        this.instructionText = instructions[1][this.tutorialService.step];
        break;
      case "de":
        this.instructionText = instructions[2][this.tutorialService.step];
        break;
    }
  }

  ngAfterViewInit() {
    this.path = this.renderer.createElement("path", "svg");
    this.renderer.addClass(this.path, "path");
    this.appendDark();
    this.modalService.openIntroTutorial();
  }

  appendDark(): void {
    this.svg = this.renderer.createElement("svg", "svg");
    this.renderer.addClass(this.svg, "svg");
    this.svg.setAttribute("viewbox", "0 0 1200 800");

    this.renderer.appendChild(this.doc.nativeElement, this.svg);
    this.appendCutOut(this.tutorialService.step);
  }

  appendCutOut(step: number) {
    switch (step) {
      case 0:
        this.tutorialService.goNextStep = true;
        document.getElementById("flex-container").removeAttribute("class");
        this.path.setAttribute(
          "d",
          "M-9 -87 H1200 V800 H-100z M 1200 0 H 0 V 50 H 1200 Z"
        );
        this.renderer.appendChild(this.svg, this.path);
        break;
      case 1:
        this.tutorialService.goNextStep = true;
        // document.getElementById("panel").removeAttribute("class");
        document.getElementById("panel").classList.remove("tool-highlight");
        document
          .getElementById("flex-container")
          .setAttribute("class", "rooms-highlight");
        this.path.setAttribute(
          "d",
          "M-9 -87 H1200 V800 H-100z M 192 50 H 0 V 800 H 192 Z"
        );
        this.renderer.appendChild(this.svg, this.path);
        break;
      case 2:
        this.canvasService.emitClearSVG();
        this.tutorialService.goNextStep = false;
        this.path.setAttribute(
          "d",
          "M-9 -87 H1200 V800 H-100z M 287 50 H 194V 758 H 287 Z"
        );
        this.renderer.appendChild(this.svg, this.path);
        document.getElementById("canvas").setAttribute("class", "canvas-left");
        document.getElementById("panel").classList.add("tool-highlight");
        document.getElementById("flex-container").removeAttribute("class");
        break;
      case 3:
        this.score = 0;
        this.tutorialService.goNextStep = false;
        document.getElementById("guess-zone").removeAttribute("class");
        document.getElementById("panel").classList.add("tool-highlight");
        this.path.setAttribute(
          "d",
          "M-9 -87 H1200 V800 H-100z M 960 50 H 191V 758 H 960 Z"
        );
        this.renderer.appendChild(this.svg, this.path);
        document
          .getElementById("canvas")
          .setAttribute("class", "canvas-highlight");
        break;
      case 4:
        this.teammateGuessed();
        break;
      case 5:
        this.score = 1;
        this.tutorialService.goNextStep = false;
        document.getElementById("guess-zone").removeAttribute("class");
        document
          .getElementById("right-wrapper")
          .classList.add("right-highlight");
        document
          .getElementById("canvas")
          .setAttribute("class", "canvas-highlight");
        const wordImage = {
          word: "banana",
          game: this.authService.username,
        };
        this.socketService.socket.emit("join-game", this.authService.username);
        this.socketService.socket.emit("word-image", JSON.stringify(wordImage));
      case 6:
        this.socketService.socket.emit("stop-word", this.authService.username);
        this.tutorialService.goNextStep = false;
        setTimeout(() => {
          this.canvasService.emitClearSVG();
        }, 500);
        break;

      default:
        break;
    }
  }

  teammateGuessed() {
    this.socketService.socket.emit("stop-word", this.authService.username);
    this.tutorialService.goNextStep = true;
    this.step4Count++;
    document
      .getElementById("right-wrapper")
      .classList.remove("right-highlight");
    document.getElementById("panel").classList.remove("tool-highlight");
    document.getElementById("canvas").removeAttribute("class");
    document
      .getElementById("guess-zone")
      .setAttribute("class", "guess-highlight");
    this.path.setAttribute(
      "d",
      "M-9 -87 H1200 V800 H-20z M 1200 170 H 960 V 260 H 1200 Z"
    );
    setTimeout(() => {
      this.canvasService.emitClearSVG();
    }, 500);
    this.score=1;

    if (this.step4Count == 1) {
      this.gameService.sendTutorialGuess();
    }
    this.renderer.appendChild(this.svg, this.path);
  }

  nextStep() {
    this.tutorialService.step++;

    this.progressValue = (this.tutorialService.step / 6) * 100;
    this.translateInstruction();
    this.appendCutOut(this.tutorialService.step);
    if(this.tutorialService.step===6)
      this.score = 2;
  }

  previousStep() {
    if (this.tutorialService.step != 0) {
      this.tutorialService.step--;
      this.progressValue = (this.tutorialService.step / 6) * 100;
      this.translateInstruction();
      this.appendCutOut(this.tutorialService.step);
    } else if (this.tutorialService.step != 0) this.progressValue = 0;
  }

  setTeams(): void {
    let realPlayer = {
      username: this.authService.username,
      avatar: this.authService.avatar,
      state: PlayerStates.HumanDrawing,
      position: PlayerPosition.firstMember,
      team: TeamPosition.teamA,
    };
    let player2 = {
      username: "Yanis",
      avatar: "avatar6",
      state: PlayerStates.HumanGuessing,
      position: PlayerPosition.secondMember,
      team: TeamPosition.teamA,
    };
    let player3 = {
      username: "Yuhan",
      avatar: "avatar1",
      state: PlayerStates.HumanWatching,
      position: PlayerPosition.firstMember,
      team: TeamPosition.teamB,
    };
    let player4 = {
      username: "Nhien",
      avatar: "avatar2",
      state: PlayerStates.HumanWatching,
      position: PlayerPosition.secondMember,
      team: TeamPosition.teamB,
    };
    this.team1.push(realPlayer);
    this.team1.push(player2);
    this.team2.push(player3);
    this.team2.push(player4);
  }

  openWarning(): void {
    if (this.tutorialService.step !== 6)
      this.modalService.openWarning(WARNING_TYPE.LEAVE_TUTORIAL, "");
    else this.goHome();
  }

  // moved to warning-dialog.component.ts
  goHome(): void {
    this.router.navigate(["/menu"]);
    this.socketService.socket.disconnect();
    this.tutorialService.goNextStep = true;
    this.canvasService.clearUndoRedoHistory();
  }

  findImgSrc(name: string): string {
    return profilePics.find((o) => o.name === name).src;
  }
}
