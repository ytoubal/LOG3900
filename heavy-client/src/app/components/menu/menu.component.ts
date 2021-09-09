import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AuthentificationService } from "src/app/services/authentification/authentification.service";
import { RoomService } from "src/app/services/room/room.service";
import { IRoom } from "../../../../../server/app/interfaces/IRoom";
import { SnackbarService } from "src/app/services/snackbar/snackbar.service";
import {
  IResponse,
  Status,
} from "../../../../../server/app/interfaces/IResponse";
import { Router } from "@angular/router";
import { difficulties } from "src/app/const/difficulties";
import { ModalService } from "src/app/services/modal/modal.service";
import { LobbyService } from "src/app/services/lobby/lobby.service";
import { profilePics } from "src/app/const/profile-pics";
import { DATABASE_URL } from "src/app/const/database-url";
import { ThemeService } from "src/app/services/theme/theme.service";
import { TranslateService } from "@ngx-translate/core";
import { SocketService } from "src/app/services/socket/socket.service";
import { Levels } from "src/app/const/levels";
import { IUserInfo } from "../../../../../server/app/interfaces/IUserInfo";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "my-auth-token",
  }),
};

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnInit {
  @ViewChild("chat-input", { static: false }) chatInput: ElementRef;

  user: IUserInfo["public"] = {
    username: this.authService.username,
    avatar: this.authService.avatar,
    pointsXP: this.authService.pointsXP,
    album: this.authService.album,
  };

  private menuOptionsForm: FormGroup;
  lobbyFormControl: FormControl;
  difficulties: string[] = difficulties;
  gameModes: string[] = ["Any", "Classic", "Sprint Solo"];
  lobbyName: string = "";

  allLobbies = [];
  availableLobbies = [];

  currentDiff: string = this.difficulties[0];
  currentMode: string = this.gameModes[0];

  constructor(
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    public http: HttpClient,
    private router: Router,
    private roomService: RoomService,
    private authService: AuthentificationService,
    private modalService: ModalService,
    private lobbyService: LobbyService,
    public themeService: ThemeService,
    public translate: TranslateService,
    private renderer: Renderer2,
    private socketService: SocketService
  ) {
    if (this.translate.currentLang.toString() === "fr")
      this.currentDiff = "Tout";
    else if (this.translate.currentLang.toString() === "de")
      this.currentDiff = "Alle";
  }

  ngOnInit() {
    this.openTutorial();
    this.getLobbies();
    this.themeService.toggle();
    if (this.checkLevelUp()) this.openLevelUp();
  }

  async getUserRooms() {
    const params = new HttpParams().set("username", this.authService.username); // Create new HttpParams
    return this.http
      .get(DATABASE_URL + "/database/user-rooms", { params })
      .subscribe((data) => {
        for (let element of JSON.parse(JSON.stringify(data)).rooms) {
        }
      });
  }

  async getLobbies() {
    return this.http
      .get(DATABASE_URL + "/database/all-lobbies")
      .subscribe((data) => {
        for (let element of JSON.parse(JSON.stringify(data))) {
          this.allLobbies.push(element);
        }
        this.availableLobbies = this.allLobbies.slice();
        if (this.availableLobbies.length === 0) {
          const lang = this.translate.currentLang.toString();
          if (lang === "en")
            this.snackbarService.openSnackBar(
              "There are presently no available lobbies.",
              "Close"
            );
          else if (lang === "fr")
            this.snackbarService.openSnackBar(
              "Il n'y aucun lobby de disponible.",
              "Fermer"
            );
          else
            this.snackbarService.openSnackBar(
              "Derzeit sind keine Lobbys verfügbar.",
              "Schließen"
            );
        }
      });
  }

  refreshLobbies(): void {
    this.allLobbies = [];
    this.availableLobbies = [];
    this.getLobbies();
  }

  openCreateLobby(): void {
    this.modalService.openCreateLobby();
  }

  joinLobby(lobby: string, owner: string, difficulty: string, rounds: number) {
    const object = { name: lobby, user: this.user };
    this.http
      .post<any>(DATABASE_URL + "/database/lobby-users", object, httpOptions)
      .subscribe((data: any) => {
        const lang = this.translate.currentLang.toString();
        if (data.status == Status.MAXIMUM_USERS) {
          if (lang === "en")
            this.snackbarService.openSnackBar("Lobby full", "Close");
          else if (lang === "fr")
            this.snackbarService.openSnackBar(
              "Le lobby est complet.",
              "Fermer"
            );
          else
            this.snackbarService.openSnackBar(
              "Die Lobby ist voll.",
              "Schließen"
            );
        } else if (data.status == Status.LOBBY_JOINED) {
          // this.snackbarService.openSnackBar("Lobby joined!", "Close");

          this.socketService.setUpSocketConnection();
          this.lobbyService.name = lobby;
          this.lobbyService.owner = owner;
          this.lobbyService.difficulty = difficulty;
          this.lobbyService.rounds = rounds;
          this.router.navigate(["/waiting"]);
        } else if (data.status == Status.HTTP_NOT_FOUND) {
          if (lang === "en")
            this.snackbarService.openSnackBar(data.message, "Close");
          else if (lang === "fr")
            this.snackbarService.openSnackBar(
              "Le lobby a été supprimé.",
              "Fermer"
            );
          else
            this.snackbarService.openSnackBar(
              "Die Lobby wurde gelöscht.",
              "Schließen"
            );
        }
      });
  }

  findAvatar(name: string): string {
    return profilePics.find((o) => o.name === name).src;
  }

  checkLevelUp(): boolean {
    let nextLevel = Levels[this.authService.level];
    return this.authService.pointsXP >= nextLevel.min;
  }

  chooseDiff(diff) {
    if (this.translate.currentLang.toString() === "fr" && diff === "Any")
      this.currentDiff = "Tout";
    else if (this.translate.currentLang.toString() === "de" && diff === "Any")
      this.currentDiff = "Alle";
    else this.currentDiff = diff;
  }

  openLevelUp(): void {
    this.modalService.openLevel();
  }

  openTutorial() {
    if (this.authService.firstTime) this.modalService.openFirstTimeTutorial();
    this.authService.firstTime = false;
  }

  search() {
    if (
      this.currentDiff === "Any" ||
      this.currentDiff === "Tout" ||
      this.currentDiff === "Alle"
    )
      this.availableLobbies = this.allLobbies.slice();
    else {
      let engDiff = this.currentDiff;

      switch (this.currentDiff) {
        case "Facile":
        case "Einfach":
          engDiff = "Easy";
          break;

        case "Moyen":
        case "Mittlere":
          engDiff = "Medium";
          break;

        case "Difficile":
        case "Schwierig":
          engDiff = "Hard";
          break;
      }
      this.availableLobbies = Object.assign([], this.allLobbies).filter(
        (l) => l.difficulty.toLowerCase().indexOf(engDiff.toLowerCase()) > -1
      );
    }

    this.availableLobbies = Object.assign([], this.availableLobbies).filter(
      (l) => l.name.toLowerCase().indexOf(this.lobbyName.toLowerCase()) > -1
    );
  }

  openSearch() {
    // this.searchList = this.roomService.roomList;
    // this.toggleSearch = true;
    // this.searchbar.nativeElement.focus();
  }
}
