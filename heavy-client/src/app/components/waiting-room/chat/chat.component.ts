import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { LobbyService } from "src/app/services/lobby/lobby.service";
import { io, Socket } from "socket.io-client/build/index";
import { DATABASE_URL } from "src/app/const/database-url";
import { IMessageContent } from "../../../../../../server/app/interfaces/IMessageContent";
import { AuthentificationService } from "src/app/services/authentification/authentification.service";
import { profilePics } from "src/app/const/profile-pics";
import { GameService } from "src/app/services/game/game-service.service";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AUDIO_SRC } from "src/app/enum/audioSrc";
import { ThemeService } from "src/app/services/theme/theme.service";
import { SocketService } from "src/app/services/socket/socket.service";
import { TutorialService } from "src/app/services/tutorial/tutorial.service";
import { PlayerStates } from "../../../../../../server/app/enums/gameEnums";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatComponent implements OnInit {
  @ViewChild("currentUserMessage", { static: false })
  messageList: ElementRef;
  @ViewChild("chat-input", { static: false }) chatInput: ElementRef;
  @ViewChild("container", { static: false }) chatContainer: ElementRef;

  lobbyName: string;
  // socket: Socket;
  username: string;
  sentMessage: string;
  audio: HTMLMediaElement = new Audio();

  constructor(
    private lobbyService: LobbyService,
    private authService: AuthentificationService,
    private renderer: Renderer2,
    public router: Router,
    public gameService: GameService,
    public themeService: ThemeService,
    public tutorialService: TutorialService,
    public translate: TranslateService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.lobbyName = this.lobbyService.name;
    this.username = this.authService.username;
    this.gameService.botMsgListener().subscribe((botMessage: any) => {
      this.otherBubble(
        botMessage.message,
        botMessage.timestamp,
        botMessage.sender,
        botMessage.avatar
      );
    });
    this.setUpSocketConnection();
  }

  setUpSocketConnection(): void {
    // let socket = io(DATABASE_URL, {
    //   transports: ["websocket", "polling", "flashsocket"],
    // });
    // this.socket = socket;

    // this.socket.emit("room-joined", this.lobbyName);

    this.socketService.socket.on("send-message", (message: IMessageContent) => {
      const messageData = JSON.parse(JSON.stringify(message));
      // if (messageData.room == this.lobbyName) {
      if (messageData.sender === this.username) {
        this.selfBubble(
          messageData.message,
          messageData.timestamp,
          messageData.avatar
        );
      } else {
        this.otherBubble(
          messageData.message,
          messageData.timestamp,
          messageData.sender,
          messageData.avatar
        );
      }
      // }
    });
  }

  otherBubble(
    msg: string,
    currentTime: string,
    username: string,
    avatar: string
  ) {
    const userDiv = this.renderer.createElement("div");
    this.renderer.addClass(userDiv, "other-user-message");

    const userProfile = this.renderer.createElement("div");
    this.renderer.addClass(userProfile, "user-container");

    const userAvatarDiv = this.renderer.createElement("div");
    this.renderer.addClass(userAvatarDiv, "other-user-avatar");
    const userAvatarImg = this.renderer.createElement("img");
    this.renderer.addClass(userAvatarImg, "image");

    let icon = "assets/images/anon_icon.jpg";
    profilePics.forEach((data) => {
      if (data.name == avatar) {
        icon = data.src;
      }
    });

    this.renderer.setAttribute(userAvatarImg, "src", icon);

    const currentUsername = this.renderer.createElement("div");
    this.renderer.addClass(currentUsername, "username");
    currentUsername.innerHTML = username;

    const currentUserTxtDiv = this.renderer.createElement("div");
    this.renderer.addClass(currentUserTxtDiv, "other-user-text");
    
    const timeDiv = this.renderer.createElement("div");
    this.renderer.addClass(timeDiv, "timeDiv");
    
    if (this.router.url == "/tutorial" || this.router.url == "/workspace") {
      this.renderer.addClass(userAvatarImg, "in-game");
      currentUserTxtDiv.classList.add(
        "other-user-text",
        "in-game",
        this.themeService.theme
      );
      timeDiv.classList.add("timeDiv", "in-game", this.themeService.theme);
    } else {
      currentUserTxtDiv.classList.add(
        "other-user-text",
        this.themeService.theme
      );
      timeDiv.classList.add("timeDiv", this.themeService.theme);
    }
    
    currentUserTxtDiv.innerHTML = msg;
    timeDiv.innerHTML = currentTime;

    this.renderer.appendChild(userAvatarDiv, userAvatarImg);
    this.renderer.appendChild(userDiv, userProfile);
    this.renderer.appendChild(userProfile, userAvatarDiv);
    this.renderer.appendChild(userProfile, currentUsername);

    this.renderer.appendChild(userDiv, currentUserTxtDiv);
    this.renderer.appendChild(this.messageList.nativeElement, userDiv);
    this.renderer.appendChild(userDiv, timeDiv);

    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
  }

  selfBubble(msg: string, currentTime: string, avatar: string): void {
    const currentUserDiv = this.renderer.createElement("div");
    this.renderer.addClass(currentUserDiv, "current-user-message");

    const currentUserProfile = this.renderer.createElement("div");
    this.renderer.addClass(currentUserProfile, "user-container");

    const currentUserAvatarDiv = this.renderer.createElement("div");
    this.renderer.addClass(currentUserAvatarDiv, "current-user-avatar");
    const currentUserAvatarImg = this.renderer.createElement("img");
    this.renderer.addClass(currentUserAvatarImg, "image");

    let icon = "assets/images/anon_icon.jpg";
    profilePics.forEach((data) => {
      if (data.name == avatar) {
        icon = data.src;
      }
    });

    this.renderer.setAttribute(currentUserAvatarImg, "src", icon);

    const currentUsername = this.renderer.createElement("div");
    this.renderer.addClass(currentUsername, "username");
    currentUsername.innerHTML = this.username;

    const currentUserTxtDiv = this.renderer.createElement("div");
    const timeDiv = this.renderer.createElement("div");
    this.renderer.addClass(timeDiv, "timeDiv");
    if (
      this.router.url != "/tutorial" &&
      this.gameService.activeTeam &&
      !this.gameService.isDrawing &&
      this.gameService.guessCount <= this.gameService.guessLimit &&
      msg.toLocaleUpperCase() !==
        this.gameService.wordImageService.currentWords[
          this.gameService.currentRound - 1
        ].toUpperCase()
    ) {
      this.renderer.addClass(currentUserAvatarImg, "in-game");
      currentUserTxtDiv.classList.add(
        "current-guesser-text",
        this.themeService.theme
      );
      timeDiv.classList.add("timeDiv", "in-game", this.themeService.theme);
      this.gameService.playAudio(AUDIO_SRC.GUESS_WRONG);
    } else if (
      this.router.url === "/tutorial" &&
      msg.toLocaleUpperCase() !== "BANANA" &&
      this.tutorialService.step === 5
    ) {
      this.renderer.addClass(currentUserAvatarImg, "in-game");
      currentUserTxtDiv.classList.add(
        "current-guesser-text",
        this.themeService.theme
      );
      timeDiv.classList.add("timeDiv", "in-game", this.themeService.theme);
      this.gameService.playAudio(AUDIO_SRC.GUESS_WRONG);
    } else {
      // this.renderer.addClass(currentUserTxtDiv, "current-user-text");
      if (this.router.url == "/tutorial" || this.router.url == "/workspace") {
        this.renderer.addClass(currentUserAvatarImg, "in-game");
        this.renderer.addClass(currentUserAvatarImg, "in-game");
        currentUserTxtDiv.classList.add(
          "current-user-text",
          "in-game",
          this.themeService.theme
        );
        timeDiv.classList.add("timeDiv", "in-game", this.themeService.theme);
      } else {
        currentUserTxtDiv.classList.add(
          "current-user-text",
          this.themeService.theme
        );
        timeDiv.classList.add("timeDiv", this.themeService.theme);
      }
      if (
        (this.router.url === "/workspace" &&
        this.gameService.activeTeam &&
        this.gameService.currentAction !== PlayerStates.HumanDrawing) ||
        (this.router.url === "/tutorial" &&
          msg.toLocaleUpperCase() === "BANANA" &&
          this.tutorialService.step === 5)
      )
        this.gameService.playAudio(AUDIO_SRC.GUESS_RIGHT);
    }

    currentUserTxtDiv.innerHTML = msg;
    timeDiv.innerHTML = currentTime;

    this.renderer.appendChild(currentUserAvatarDiv, currentUserAvatarImg);
    this.renderer.appendChild(currentUserDiv, currentUserProfile);
    this.renderer.appendChild(currentUserProfile, currentUserAvatarDiv);
    this.renderer.appendChild(currentUserProfile, currentUsername);

    this.renderer.appendChild(currentUserDiv, currentUserTxtDiv);
    this.renderer.appendChild(this.messageList.nativeElement, currentUserDiv);
    this.renderer.appendChild(currentUserDiv, timeDiv);

    this.sentMessage = "";
    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
  }

  sendMessage() {
    if (this.sentMessage.trim()) {
      if (this.router.url != "/tutorial") {
        const message: IMessageContent = {
          message: this.sentMessage.trim(),
          sender: this.username,
          timestamp: "",
          room: "$$_" + this.lobbyName + "_$$",
          avatar: this.authService.avatar,
        };
        this.socketService.socket.emit("send-message", JSON.stringify(message));

        if (
          this.gameService.activeTeam &&
          !this.gameService.isDrawing &&
          this.router.url === "/workspace"
        ) {
          this.gameService.guessWord(message.message);
        }
      } else {
        if (this.sentMessage.trim().toLocaleUpperCase() === "BANANA")
          this.tutorialService.goNextStep = true;

        const message: IMessageContent = {
          message: this.sentMessage.trim(),
          sender: this.username,
          timestamp: "",
          room: this.authService.username,
          avatar: this.authService.avatar,
        };
        this.selfBubble(message.message, message.timestamp, message.avatar);
      }
    }
  }
}
