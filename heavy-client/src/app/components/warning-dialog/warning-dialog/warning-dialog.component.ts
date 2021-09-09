import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Component, OnInit } from "@angular/core";
import { WARNING_TYPE } from "src/app/enum/warningType";
import { TranslateService } from "@ngx-translate/core";
import { Inject } from "@angular/core";
import { Router } from "@angular/router";
import { SocketService } from "src/app/services/socket/socket.service";
import { LobbyService } from "src/app/services/lobby/lobby.service";
import { ChatService } from "src/app/services/chat/chat.service";
import { RoomService } from "src/app/services/room/room.service";
import { TutorialService } from "src/app/services/tutorial/tutorial.service";
import { ThemeService } from "src/app/services/theme/theme.service";
import { CanvasService } from "src/app/services/drawing/canvas.service";
import { CreatePairService } from "src/app/services/create-pair/create-pair.service";
@Component({
  selector: "app-warning-dialog",
  templateUrl: "./warning-dialog.component.html",
  styleUrls: ["./warning-dialog.component.scss"],
})
export class WarningDialogComponent implements OnInit {
  isLobby: boolean = false;
  isRoom: boolean = false;
  isTutorial: boolean = false;
  isBackDraw: boolean = false;
  isLeaveDraw: boolean = false;

  constructor(
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public type: { type: WARNING_TYPE; room: string },
    public router: Router,
    private socketService: SocketService,
    private lobbyService: LobbyService,
    private chatService: ChatService,
    private roomService: RoomService,
    private tutorialService: TutorialService,
    public themeService: ThemeService,
    public dialogRef: MatDialogRef<WarningDialogComponent>,
    private canvasService: CanvasService,
    private createPairService: CreatePairService
  ) {}

  ngOnInit() {
    this.themeService.toggle();

    switch (this.type.type) {
      case WARNING_TYPE.LEAVE_LOBBY:
        this.isLobby = true;
        break;
      case WARNING_TYPE.LEAVE_TUTORIAL:
        this.canvasService.clearUndoRedoHistory();
        this.isTutorial = true;
        break;
      case WARNING_TYPE.DELETE_ROOM:
        this.isRoom = true;
        break;
      case WARNING_TYPE.LEAVE_DRAWING:
        this.canvasService.clearUndoRedoHistory();
        this.isLeaveDraw = true;
        break;
      case WARNING_TYPE.BACK_DRAWING:
        this.canvasService.clearUndoRedoHistory();
        this.isBackDraw = true;
        break;
    }
  }

  leave(): void {
    if (this.type.type === WARNING_TYPE.LEAVE_LOBBY) {
      this.socketService.socket.emit("delete-lobby", this.lobbyService.name);
      this.router.navigate(["/menu"]);
      this.dialogRef.close();
    } else if (this.type.type === WARNING_TYPE.DELETE_ROOM) {
      this.chatService.sockets[this.type.room].emit(
        "delete-room",
        this.type.room
      );
      for (let element of this.roomService.roomList) {
        if (element.name == this.type.room) {
          this.roomService.roomList.splice(
            this.roomService.roomList.indexOf(element),
            1
          );
        }
      }
    } else if (this.type.type === WARNING_TYPE.BACK_DRAWING) {
      if (this.type.room === "draw") {
        this.createPairService.isSourceChosen = true;
        this.createPairService.isDraw = true;
        this.createPairService.showConfigs = false;
        this.canvasService.htmlElement.innerHTML = this.createPairService.htmlElement.innerHTML;
      } else if (this.type.room === "upload") {
        this.createPairService.showPotConfigs = false;
        this.createPairService.showConfigs = false;
        this.createPairService.isUpload = true;
      } else {
        this.createPairService.isDraw = false;
        this.createPairService.isUpload = false;
        this.createPairService.isSourceChosen = false;
        this.createPairService.showPotConfigs = false;
        this.createPairService.showConfigs = false;
      }
    } else if (this.type.type === WARNING_TYPE.LEAVE_DRAWING) {
      this.router.navigate([this.type.room]);
      this.canvasService.isDrawingWordImage = false;
      this.createPairService.isDraw = false;
      this.createPairService.isUpload = false;
      this.createPairService.isSourceChosen = false;
      this.createPairService.showPotConfigs = false;
      this.createPairService.showConfigs = false;
    } else {
      this.router.navigate(["/menu"]);
      this.socketService.socket.disconnect();
      this.tutorialService.goNextStep = true;
    }
  }
}
