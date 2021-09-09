import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { DATABASE_URL } from "src/app/const/database-url";
import { difficulties } from "src/app/const/difficulties";
import { numTurns } from "src/app/const/numTurns";
import { AuthentificationService } from "src/app/services/authentification/authentification.service";
import { LobbyService } from "src/app/services/lobby/lobby.service";
import { SnackbarService } from "src/app/services/snackbar/snackbar.service";
import { SocketService } from "src/app/services/socket/socket.service";
import { ThemeService } from "src/app/services/theme/theme.service";
import { ILobby } from "../../../../../../server/app/interfaces/ILobby";
import { IResponse } from "../../../../../../server/app/interfaces/IResponse";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "my-auth-token",
  }),
};

@Component({
  selector: "app-create-lobby",
  templateUrl: "./create-lobby.component.html",
  styleUrls: ["./create-lobby.component.scss"],
})
export class CreateLobbyComponent implements OnInit {
  lobbyName: string = "";

  difficulties: string[] = difficulties.slice(1, 4);
  currentDiff = this.difficulties[0];

  turns: number[] = numTurns;
  currentTurn = this.turns[0];
  lobbyNameFormControl = new FormControl(
    "",
    Validators.compose([
      Validators.required,
      Validators.maxLength(10),
      this.noWhitespaceValidator,
    ])
  );

  constructor(
    public lobbyService: LobbyService,
    public themeService: ThemeService,
    private http: HttpClient,
    private router: Router,
    private snackbarService: SnackbarService,
    private authService: AuthentificationService,
    private socketService: SocketService,
    public translate: TranslateService,
    private dialogRef: MatDialogRef<CreateLobbyComponent>
  ) {
    if (translate.currentLang.toString() === "en")
      this.currentDiff = this.difficulties[0];
    else if (translate.currentLang.toString() === "fr")
      this.currentDiff = "Facile";
    else if (translate.currentLang.toString() === "de")
      this.currentDiff = "Einfach";
  }

  ngOnInit() {
    // this.lobbyService.getLobbies();
    this.themeService.toggle();
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  createLobby(): void {
    switch (this.currentDiff) {
      case "Facile":
      case "Einfach":
        this.currentDiff = "Easy";
        break;
      case "Moyen":
      case "Mittlere":
        this.currentDiff = "Medium";
        break;
      case "Difficile":
      case "Schwierig":
        this.currentDiff = "Hard";
        break;
    }

    const LOBBY_INFO: ILobby = {
      name: this.lobbyName,
      difficulty: this.currentDiff,
      owner: this.authService.username,
      users: [
        {
          username: this.authService.username,
          avatar: this.authService.avatar,
          pointsXP: this.authService.pointsXP,
          album: this.authService.album,
        },
      ],
      rounds: this.currentTurn,
    };

    this.http
      .post<any>(
        DATABASE_URL + "/database/insert-lobby",
        LOBBY_INFO,
        httpOptions
      )
      .subscribe((data: IResponse) => {
        const status = data.status;
        if (status == 201) {
          this.lobbyService.name = this.lobbyName;
          this.lobbyService.owner = this.authService.username;
          this.lobbyService.difficulty = this.currentDiff;
          this.lobbyService.rounds = this.currentTurn;
          this.socketService.setUpSocketConnection();
          this.router.navigate(["/waiting"]);
          this.dialogRef.close();
        } else if (status == 0) {
          const lang = this.translate.currentLang.toString();
          if (lang === "en")
            this.snackbarService.openSnackBar("Lobby already exists.", "Close");
          else if (lang === "fr")
            this.snackbarService.openSnackBar(
              "Le lobby existe déjà.",
              "Fermer"
            );
          else
            this.snackbarService.openSnackBar(
              "Die Lobby existiert bereits.",
              "Schließen"
            );
        }
      });
  }
}
