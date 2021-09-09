import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { DATABASE_URL } from "src/app/const/database-url";
import { AuthentificationService } from "src/app/services/authentification/authentification.service";
import { RoomService } from "src/app/services/room/room.service";
import { SnackbarService } from "src/app/services/snackbar/snackbar.service";
import { ThemeService } from "src/app/services/theme/theme.service";
import { IResponse } from "../../../../../../server/app/interfaces/IResponse";
import { IRoom } from "../../../../../../server/app/interfaces/IRoom";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "my-auth-token",
  }),
};
@Component({
  selector: "app-new-room-dialog",
  templateUrl: "./new-room-dialog.component.html",
  styleUrls: ["./new-room-dialog.component.scss"],
})
export class NewRoomDialogComponent implements OnInit {
  @Output() clicked: EventEmitter<any> = new EventEmitter();

  roomName: string = "";

  formControl = new FormControl(
    "",
    Validators.compose([
      Validators.maxLength(10),
      Validators.required,
      this.noWhitespaceValidator,
    ])
  );
  constructor(
    private authService: AuthentificationService,
    private roomService: RoomService,
    private snackbarService: SnackbarService,
    public themeService: ThemeService,
    public http: HttpClient,
    public dialogRef: MatDialogRef<NewRoomDialogComponent>,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.themeService.toggle();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  async createChatRoom(): Promise<void> {
    const createdRoom: IRoom = {
      name: this.roomName,
      history: [],
      admin: this.authService.username,
    };
    this.http
      .post<any>(
        // "https://painseau.herokuapp.com/database/insert",
        DATABASE_URL + "/database/insert-room",
        createdRoom,
        httpOptions
      )
      .subscribe((data: IResponse) => {
        const status = data.status;
        if (status == 201) {
          let errorMsg = "Room added.";
          let close = "Close";

          if (this.translate.currentLang.toString() === "fr") {
            errorMsg = "Ce canal a été créé.";
            close = "Fermer";
          } else if (this.translate.currentLang.toString() === "de") {
            errorMsg = "Chatraum erstellt.";
            close = "Schließen";
          }
          this.snackbarService.openSnackBar(errorMsg, close);

          this.dialogRef.close();
          this.clicked.emit();
          this.roomService.roomList.push(createdRoom);
        } else if (status == 0) {
          let errorMsg = "Room already exists. Please choose another name.";
          let close = "Close";

          if (this.translate.currentLang.toString() === "fr") {
            errorMsg = "Ce canal existe déjà. Veuillez changer de nom.";
            close = "Fermer";
          } else if (this.translate.currentLang.toString() === "de") {
            errorMsg =
              "Chatraum existiert bereits. Bitte wählen Sie einen anderen Namen.";
            close = "Schließen";
          }
          this.snackbarService.openSnackBar(errorMsg, close);
        }
      });
  }
}
