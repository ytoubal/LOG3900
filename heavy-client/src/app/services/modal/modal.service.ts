import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import { NewRoomDialogComponent } from "src/app/components/chatbox/new-room-dialog/new-room-dialog.component";
import { EndGameDialogComponent } from "src/app/components/drawing/workplace-page/end-game-dialog/end-game-dialog.component";
import { LevelUpDialogComponent } from "src/app/components/drawing/workplace-page/level-up-dialog/level-up-dialog/level-up-dialog.component";
import { CreateLobbyComponent } from "src/app/components/menu/create-lobby/create-lobby.component";
import { FirstTimeComponent } from "src/app/components/menu/first-time/first-time.component";
import { EditProfileModalComponent } from "src/app/components/profile/edit-profile-modal/edit-profile-modal.component";
import { WelcomeDialogComponent } from "src/app/components/tutorial/welcome-dialog/welcome-dialog.component";
import { WarningDialogComponent } from "src/app/components/warning-dialog/warning-dialog/warning-dialog.component";
import { WARNING_TYPE } from "src/app/enum/warningType";
import { ThemeService } from "../theme/theme.service";
import { NoopScrollStrategy } from "@angular/cdk/overlay";

@Injectable({
  providedIn: "root",
})
export class ModalService {
  constructor(private dialog: MatDialog, private themeService: ThemeService) {}

  openWarning(type: WARNING_TYPE, roomName: string): void {
    this.dialog.open(WarningDialogComponent, {
      width: "280px",
      panelClass: this.themeService.theme,
      data: {
        type: type,
        room: roomName,
      },
      scrollStrategy: new NoopScrollStrategy(),
    });
  }

  openLevel(): void {
    this.dialog.open(LevelUpDialogComponent, {
      width: "32vw",
      panelClass: this.themeService.theme,
      scrollStrategy: new NoopScrollStrategy(),
    });
  }

  openEdit(): void {
    this.dialog.open(EditProfileModalComponent, {
      width: "520px",
      height: "600px",
      panelClass: this.themeService.theme,
    });
  }

  openNewRoom() {
    this.dialog.open(NewRoomDialogComponent, {
      width: "280px",
      panelClass: this.themeService.theme,
      scrollStrategy: new NoopScrollStrategy(),
    });
  }

  openCreateLobby() {
    this.dialog.open(CreateLobbyComponent, {
      width: "280px",
      panelClass: this.themeService.theme,
      scrollStrategy: new NoopScrollStrategy(),
    });
  }

  openEndGame() {
    this.dialog.open(EndGameDialogComponent, {
      // width: "400px",
      // height: "500px",
      width: "1200px",
      height: "800px",
      panelClass: this.themeService.theme,
      // data: { score: game.scores }
    });
  }

  openFirstTimeTutorial() {
    this.dialog.open(FirstTimeComponent, {
      width: "510",
      height: "205px",
      panelClass: this.themeService.theme,
    });
  }

  openIntroTutorial() {
    this.dialog.open(WelcomeDialogComponent, {
      width: "375px",
      panelClass: this.themeService.theme,
      scrollStrategy: new NoopScrollStrategy(),
    });
  }
}
