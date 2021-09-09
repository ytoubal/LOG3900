import { HttpClient } from "@angular/common/http";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { HttpHeaders } from "@angular/common/http";
import { Component, inject, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { io, Socket } from "socket.io-client/build/index";
import { browserRefresh } from "../../../app.component";
import { Router } from "@angular/router";
import {
  IResponse,
  Status,
} from "../../../../../../server/app/interfaces/IResponse";
import { IUserUpdate } from "../../../../../../server/app/interfaces/IUserInfo";
import { AuthentificationService } from "src/app/services/authentification/authentification.service";
import { DATABASE_URL } from "src/app/const/database-url";
import { SocketService } from "src/app/services/socket/socket.service";
import { ChatService } from "src/app/services/chat/chat.service";
import { CanvasService } from "src/app/services/drawing/canvas.service";
import { ThemeService } from "src/app/services/theme/theme.service";
import { CreatePairService } from "src/app/services/create-pair/create-pair.service";
import { ModalService } from "src/app/services/modal/modal.service";
import { WARNING_TYPE } from "src/app/enum/warningType";
import { TranslateService } from "@ngx-translate/core";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "my-auth-token",
  }),
};

@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"],
})
export class ToolbarComponent implements OnInit {
  connectedUsername: string;
  socket: Socket;
  browserRefresh: boolean;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public router: Router,
    public http: HttpClient,
    private authService: AuthentificationService,
    private chatService: ChatService,
    private canvasService: CanvasService,
    public themeService: ThemeService,
    private createPairService: CreatePairService,
    private modalService: ModalService,
    public translate: TranslateService
  ) {
    this.connectedUsername = this.authService.username;

    this.matIconRegistry.addSvgIcon(
      "podium",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/podium.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "logout",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/logout.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "pairword",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/pairword.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "profile",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/profile.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "school",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/school.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "settings",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/settings.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "back",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/back.svg")
    );
  }

  ngOnInit() {
    this.browserRefresh = browserRefresh;
    if (this.browserRefresh) {
      this.logout();
      this.router.navigate(["/menu"]);
      this.canvasService.isDrawingWordImage = false;
    }
  }

  isMenu() {
    return location.pathname.indexOf("/menu") > -1;
  }

  goCreatePair(): void {
    this.router.navigate(["/createpair"]);
  }

  goProfile(): void {
    if (this.router.url === "/createpair") this.onCreatePair("/profile");
    else {
      this.router.navigate(["/profile"]);
      this.canvasService.isDrawingWordImage = false;
    }
  }

  onCreatePair(path: string): void {
    if (this.createPairService.showConfigs || this.createPairService.isDraw) {
      this.modalService.openWarning(WARNING_TYPE.LEAVE_DRAWING, path);
    } else {
      this.router.navigate([path]);
      this.canvasService.isDrawingWordImage = false;
    }
  }

  goHome(): void {
    if (this.router.url === "/createpair") this.onCreatePair("/menu");
    else {
      this.router.navigate(["/menu"]);
      this.canvasService.isDrawingWordImage = false;
    }
  }

  goLeaderboard(): void {
    if (this.router.url === "/createpair") this.onCreatePair("/leaderboard");
    else {
      this.router.navigate(["/leaderboard"]);
      this.canvasService.isDrawingWordImage = false;
    }
  }

  goSettings(): void {
    if (this.router.url === "/createpair") this.onCreatePair("/settings");
    else {
      this.router.navigate(["/settings"]);
      this.canvasService.isDrawingWordImage = false;
    }
  }

  goTutorial(): void {
    if (this.router.url === "/createpair") this.onCreatePair("/tutorial");
    else {
      this.router.navigate(["/tutorial"]);
      this.canvasService.isDrawingWordImage = false;
    }
  }

  logout(): void {

    this.canvasService.isDrawingWordImage = false;

    this.authService.deconnection = new Date().toLocaleString();
    let connectionHistory = [
      this.authService.connection,
      this.authService.deconnection,
    ];
    let element = {
      username: this.authService.username,
      history: connectionHistory,
    };
    this.router.navigate(["/"]);
    this.chatService.resetAllConnections();
  }

}
