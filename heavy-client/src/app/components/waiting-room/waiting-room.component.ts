import { HttpClient, HttpParams } from "@angular/common/http";
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { io, Socket } from "socket.io-client/build/index";
import { botNames } from "src/app/const/bot-names";
import { DATABASE_URL } from "src/app/const/database-url";
import { profilePics } from "src/app/const/profile-pics";
import { WARNING_TYPE } from "src/app/enum/warningType";
import { AuthentificationService } from "src/app/services/authentification/authentification.service";
import { GameService } from "src/app/services/game/game-service.service";
import { LobbyService } from "src/app/services/lobby/lobby.service";
import { ModalService } from "src/app/services/modal/modal.service";
import { SnackbarService } from "src/app/services/snackbar/snackbar.service";
import { SocketService } from "src/app/services/socket/socket.service";
import { ThemeService } from "src/app/services/theme/theme.service";
import { WordImageService } from "src/app/services/wordImage/wordImage.service";
import {
  PlayerPosition,
  PlayerStates,
  TeamPosition,
  TeamsState,
} from "../../../../../server/app/enums/gameEnums";
import { IUserInfo } from "../../../../../server/app/interfaces/IUserInfo";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-waiting-room",
  templateUrl: "./waiting-room.component.html",
  styleUrls: ["./waiting-room.component.scss"],
})
export class WaitingRoomComponent implements OnInit {
  @ViewChild("team1", { static: false }) team1: ElementRef;
  @ViewChild("team2", { static: false }) team2: ElementRef;

  // socket: Socket;
  gameStarted: boolean;
  currentLobby: string;
  owner: string;
  user: IUserInfo["public"] = {
    username: this.authService.username,
    avatar: this.authService.avatar,
    pointsXP: this.authService.pointsXP,
    album: this.authService.album,
  };

  position: number;

  presentMembers = new Array(4).fill("");
  neutralMembers = new Array(4).fill("");
  team1Members = new Array(2).fill("");
  team2Members = new Array(2).fill("");

  botsLeft = botNames.slice();

  showVPTeam2 = false;
  showVPTeam1 = false;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public translate: TranslateService,
    private router: Router,
    private lobbyService: LobbyService,
    private authService: AuthentificationService,
    private http: HttpClient,
    private gameService: GameService,
    private wordImageService: WordImageService,
    public themeService: ThemeService,
    private socketService: SocketService,
    private snackbar: SnackbarService,
    public modalService: ModalService
  ) {
    this.matIconRegistry.addSvgIcon(
      "back",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/back.svg")
    );
  }

  ngOnInit() {
    this.themeService.toggle();
    this.currentLobby = this.lobbyService.name;
    this.owner = this.lobbyService.owner;
    this.setUpSocketConnection();

    this.getLobbyPlayers();
    this.gameStarted = false;
  }

  quitLobby(): void {
    if (this.owner == this.authService.username)
      this.modalService.openWarning(WARNING_TYPE.LEAVE_LOBBY, "");
    else {
      const lobby = { name: this.currentLobby, user: this.user };
      this.socketService.socket.emit("quit-lobby", JSON.stringify(lobby));
      this.router.navigate(["/menu"]);
    }
  }

  setUpSocketConnection() {
    this.socketService.setUpSocketConnection();

    const lobby = { name: this.currentLobby, user: this.user };
    this.socketService.socket.emit("join-lobby", JSON.stringify(lobby));

    this.socketService.socket.on("start-game", (data: any, hint: any) => {
      this.socketService.socket.off("quit-lobby");
      console.log(data);
      this.wordImageService.currentWords = data;
      this.wordImageService.currentHints = hint;
      let states = [];
      let hasVP1 = false;
      for (let member of this.team1Members) {
        if (!botNames.includes(member.username)) {
          if (member == this.team1Members[0])
            states.push(PlayerStates.HumanDrawing);
          else if (member == this.team1Members[1])
            states.push(PlayerStates.HumanGuessing);
        } else {
          hasVP1 = true;
          states.push(PlayerStates.RobotDrawing);
        }
      }

      let hasVP2 = false;
      for (let member of this.team2Members) {
        if (!botNames.includes(member.username)) {
          states.push(PlayerStates.HumanWatching);
        } else {
          hasVP2 = true;
          states.push(PlayerStates.RobotDrawing);
        }
      }

      let player1 = {
        username: this.team1Members[0].username,
        avatar: this.team1Members[0].avatar,
        state: states[0],
        position: PlayerPosition.firstMember,
        team: TeamPosition.teamA,
      };
      let player2 = {
        username: this.team1Members[1].username,
        avatar: this.team1Members[1].avatar,
        state: states[1],
        position: PlayerPosition.secondMember,
        team: TeamPosition.teamA,
      };
      let player3 = {
        username: this.team2Members[0].username,
        avatar: this.team2Members[0].avatar,
        state: states[2],
        position: PlayerPosition.firstMember,
        team: TeamPosition.teamB,
      };
      let player4 = {
        username: this.team2Members[1].username,
        avatar: this.team2Members[1].avatar,
        state: states[3],
        position: PlayerPosition.secondMember,
        team: TeamPosition.teamB,
      };

      let players = [player1, player2, player3, player4];
      let team1 = [player1, player2];
      let team2 = [player3, player4];
      this.lobbyService.players = players;
      this.lobbyService.team1 = team1;
      this.lobbyService.team2 = team2;

      let index = 0;
      for (let player of players) {
        if (player.username === this.authService.username) {
          this.lobbyService.position = index % 2;
          this.gameService.activeTeam = player.team == TeamPosition.teamA;
          this.gameService.currentAction = player.state;
          this.gameService.currentTeam = player.team;
          if (index == 0 || index == 1) {
            this.gameService.teamStates = hasVP1
              ? TeamsState.WithRobot
              : TeamsState.AllHuman;
            this.lobbyService.team = team1;
          } else {
            this.gameService.teamStates = hasVP2
              ? TeamsState.WithRobot
              : TeamsState.AllHuman;
            this.lobbyService.team = team2;
          }
          break;
        }
        index++;
      }

      let users = this.team1Members.concat(this.team2Members);
      this.lobbyService.users = users;
      this.router.navigate(["/workspace"]);
      this.gameStarted = false;
    });

    this.socketService.socket.on("join-lobby", (data: any) => {
      if (!botNames.includes(data.username)) {
        const emptyIndex = this.neutralMembers.findIndex((m) => m === "");
        this.neutralMembers[emptyIndex] = data;

        // owner will send the content of all arrays to the newly joined user
        if (this.user.username == this.owner) {
          let players = [];
          for (let member of this.team1Members) {
            member === "" ? players.push("") : players.push(member.username);
          }
          for (let member of this.team2Members) {
            member === "" ? players.push("") : players.push(member.username);
          }
          this.socketService.socket.emit("teams-info", JSON.stringify(players));
        }
      }
    });

    this.socketService.socket.on("teams-info", (data: any) => {
      if (this.user.username != this.owner) {
        let parsedData = JSON.parse(data);

        let membersInfo = [];

        for (let d of parsedData) {
          if (d !== "") {
            for (let m of this.presentMembers) {
              if (m.username == d) {
                let player = {
                  username: d,
                  avatar: m.avatar,
                };
                membersInfo.push(player);
                break;
              }
              // }
            }
          } else membersInfo.push("");
        }

        this.team1Members[0] = membersInfo[0];
        this.team1Members[1] = membersInfo[1];
        this.team2Members[0] = membersInfo[2];
        this.team2Members[1] = membersInfo[3];

        let exists = false;

        for (let m of this.presentMembers) {
          for (let d of parsedData) {
            exists = false;
            if (m !== "") {
              if (m.username == d) {
                exists = true;
                break;
              }
            }
          }
          if (!exists) {
            const emptyIndex = this.neutralMembers.findIndex((m) => m === "");
            this.neutralMembers[emptyIndex] = m;
          }
        }

        this.socketService.socket.off("teams-info");
      }
    });

    this.socketService.socket.on("quit-lobby", (data: any) => {
      if (data == this.user.username) {
        this.socketService.socket.disconnect();
        this.router.navigate(["/menu"]);
      } else {
        this.removePlayer(data);
      }
    });

    this.socketService.socket.on("delete-lobby", () => {
      if (this.router.url == "/waiting") {
        this.router.navigate(["/menu"]);
        this.snackbar.openSnackBar("This lobby has been deleted", "Close");
        this.socketService.socket.disconnect();
      }
    });

    this.socketService.socket.on("join-team", (data: any) => {
      // check if moved played is from neutral zone
      const userIndex = this.neutralMembers.findIndex(
        (m) => m.username === data.playerName
      );
      // remove from neutral zone if so
      if (userIndex !== -1) {
        this.neutralMembers.splice(userIndex, 1);
        this.neutralMembers.push("");
      }

      // if player joins team 1
      if (data.isTeam1) {
        // in case player wasn't from neutral zone, check if they were initially in team 2
        const team2Index = this.team2Members.findIndex(
          (m) => m.username === data.playerName
        );
        if (team2Index !== -1) {
          this.team2Members[team2Index] = "";
          // this.team2Members.splice(team2Index, 1);
          // this.team2Members.push("");
        }

        // add player to team 1
        const emptyIndex = this.team1Members.findIndex((m) => m === "");
        const newPlayer = {
          username: data.playerName,
          avatar: data.playerAvatar,
        };

        this.team1Members[emptyIndex] = newPlayer;
      } else {
        // do the same as previously but in reverse
        const team1Index = this.team1Members.findIndex(
          (m) => m.username === data.playerName
        );
        if (team1Index !== -1) {
          this.team1Members[team1Index] = "";
          // this.team1Members.splice(team1Index, 1);
          // this.team1Members.push("");
        }

        const emptyIndex = this.team2Members.findIndex((m) => m === "");
        const newPlayer = {
          username: data.playerName,
          avatar: data.playerAvatar,
        };

        this.team2Members[emptyIndex] = newPlayer;
      }
    });
  }

  private removePlayer(name: string): void {
    let userIndex;

    // check if removed player was in neutral zone
    userIndex = this.neutralMembers.findIndex((m) => m.username == name);

    // if so, remove
    if (userIndex !== -1) {
      this.neutralMembers.splice(userIndex, 1);
      this.neutralMembers.push("");
      return;
    }

    // check if removed player was in team 1
    userIndex = this.team1Members.findIndex((m) => m.username == name);

    // if so, remove
    if (userIndex !== -1) {
      this.team1Members[userIndex] = "";
      // this.team1Members.splice(userIndex, 1);
      // this.team1Members.push("");
      return;
    }

    // check if removed player was in team 1
    userIndex = this.team2Members.findIndex((m) => m.username == name);

    // if so, remove
    if (userIndex !== -1) {
      this.team2Members[userIndex] = "";
      // this.team2Members.splice(userIndex, 1);
      // this.team2Members.push("");
      return;
    }
  }

  async getLobbyPlayers() {
    const lobby = { name: this.currentLobby };

    // return this.http
    //   .post(DATABASE_URL + "/database/lobby-users", lobby)
    //   .subscribe((data) => {
    //     for (let element of JSON.parse(
    //       JSON.parse(JSON.stringify(data)).message
    //     )) {
    //       // we add every members of the lobby in the neutral zone
    //       if (element.username !== this.user.username) {
    //         const index = this.presentMembers.findIndex((m) => m === "");
    //         this.presentMembers[index] = element;
    //       }
    //     }
    //   });

    const params = new HttpParams().set("name", this.currentLobby);
    return this.http
      .get(DATABASE_URL + "/database/lobby-players", { params })
      .subscribe((data) => {
        for (let element of JSON.parse(JSON.stringify(data)).users) {
          // we add every members of the lobby in the neutral zone
          if (element.username !== this.user.username) {
            const index = this.presentMembers.findIndex((m) => m === "");
            this.presentMembers[index] = element;
          }
        }
      });
  }

  findImgSrc(name: string): string {
    return profilePics.find((o) => o.name === name).src;
  }

  public isTeam1Full(): boolean {
    return !this.team1Members.includes("");
  }

  public isAlreadyTeam1(): boolean {
    const userIndex = this.team1Members.findIndex(
      (m) => m.username === this.user.username
    );
    return userIndex !== -1;
  }

  public isTeam2Full(): boolean {
    return !this.team2Members.includes("");
  }

  public isAlreadyTeam2(): boolean {
    const userIndex = this.team2Members.findIndex(
      (m) => m.username === this.user.username
    );
    return userIndex !== -1;
  }

  public displayPlayerTeam1(index: number): boolean {
    return this.team1Members[index] !== "";
  }

  public displayPlayerTeam2(index: number): boolean {
    return this.team2Members[index] !== "";
  }

  public displayWaitingMember(index: number): boolean {
    return this.neutralMembers[index] !== "";
  }

  public isLobbyFull(): boolean {
    return this.isTeam1Full() && this.isTeam2Full();
  }

  // methods to add virtual players depending on the team
  public addVPTeam1(): void {
    let bot = this.botsLeft[Math.floor(Math.random() * this.botsLeft.length)];
    let selectedBotIndex = this.botsLeft.findIndex((b) => b === bot);
    this.botsLeft.splice(selectedBotIndex, 1);

    const member = {
      playerName: bot,
      playerAvatar: "virtual_player",
      lobbyName: this.currentLobby,
      isTeam1: true,
    };

    const user = {
      username: member.playerName,
      avatar: member.playerAvatar,
      pointsXP: 0,
    } as IUserInfo["public"];

    const lobby = {
      name: member.lobbyName,
      user: user,
    };

    this.socketService.socket.emit("join-lobby", JSON.stringify(lobby));
    this.socketService.socket.emit("join-team", JSON.stringify(member));
  }

  public addVPTeam2(): void {
    let bot = this.botsLeft[Math.floor(Math.random() * this.botsLeft.length)];
    let selectedBotIndex = this.botsLeft.findIndex((b) => b === bot);
    this.botsLeft.splice(selectedBotIndex, 1);

    const member = {
      playerName: bot,
      playerAvatar: "virtual_player",
      lobbyName: this.currentLobby,
      isTeam1: false,
    };

    const user = {
      username: member.playerName,
      avatar: member.playerAvatar,
      pointsXP: 0,
    } as IUserInfo["public"];

    const lobby = {
      name: member.lobbyName,
      user: user,
    };

    this.socketService.socket.emit("join-lobby", JSON.stringify(lobby));
    this.socketService.socket.emit("join-team", JSON.stringify(member));
  }

  public removeVPTeam1(botName: string): void {
    const botIndex = this.team1Members.findIndex((m) => m.username === botName);
    this.team1[botIndex] = "";
    // this.team1Members.splice(botIndex, 1);
    // this.team1Members.push("");

    this.removeVP(botName);
  }

  public removeVPTeam2(botName: string): void {
    const botIndex = this.team2Members.findIndex((m) => m.username === botName);
    this.team2[botIndex] = "";
    // this.team2Members.splice(botIndex, 1);
    // this.team2Members.push("");

    this.removeVP(botName);
  }

  private removeVP(botName: string): void {
    this.botsLeft.push(botName);

    const user = {
      username: botName,
      avatar: "virtual_player",
      pointsXP: 0,
    } as IUserInfo["public"];

    const lobby = { name: this.currentLobby, user: user };
    this.socketService.socket.emit("quit-lobby", JSON.stringify(lobby));
  }

  // methods for when a player decides to join a team
  public joinTeam1(): void {
    const teamPlayer = {
      playerName: this.user.username,
      playerAvatar: this.user.avatar,
      lobbyName: this.currentLobby,
      isTeam1: true,
    };

    this.socketService.socket.emit("join-team", JSON.stringify(teamPlayer));
  }

  public joinTeam2(): void {
    const teamPlayer = {
      playerName: this.user.username,
      playerAvatar: this.user.avatar,
      lobbyName: this.currentLobby,
      isTeam1: false,
    };

    this.socketService.socket.emit("join-team", JSON.stringify(teamPlayer));
  }

  public isVP(botName: string): boolean {
    return botNames.includes(botName);
  }

  public botPresentTeam1(): boolean {
    return this.team1Members.some((r) => botNames.includes(r.username));
  }

  public botPresentTeam2(): boolean {
    return this.team2Members.some((r) => botNames.includes(r.username));
  }

  startGame(): void {
    const lobby = {
      name: this.lobbyService.name,
      rounds: this.lobbyService.rounds,
      difficulty: this.lobbyService.difficulty,
    };
    this.socketService.socket.emit("start-game", JSON.stringify(lobby));
    this.gameStarted = true;
    this.snackbar.openSnackBar('Game is starting', 'Close');
  }
}
