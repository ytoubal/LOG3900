import { HttpClient, HttpParams } from "@angular/common/http";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { MatDialog, PageEvent } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { DATABASE_URL } from "src/app/const/database-url";
import { Levels } from "src/app/const/levels";
import { profilePics } from "src/app/const/profile-pics";
import { ProfilePic } from "src/app/interfaces/profile-pic";
import { AuthentificationService } from "src/app/services/authentification/authentification.service";
import { HttpClientService } from "src/app/services/httpClient/http-client.service";
import { ModalService } from "src/app/services/modal/modal.service";
import { ProfileService } from "src/app/services/profile/profile.service";
import { ThemeService } from "src/app/services/theme/theme.service";
import {
  IGameHistory,
  IUserInfo,
} from "../../../../../server/app/interfaces/IUserInfo";
import { EditProfileModalComponent } from "./edit-profile-modal/edit-profile-modal.component";
import firebase from "@firebase/app";
import "@firebase/storage";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  userStatus: string = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
  eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
  ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
  aliquip ex ea.`;

  // avatar: ProfilePic;

  // user: IUserInfo;
  // classicGamesPlayed: string;
  // classicGamesWinrate: string;
  // totalTime: number;
  // album: any[] = [];
  // games: any[] = [];
  // level: number;
  // pointsXP: number;
  // averageTime: number;

  deleteImg: boolean = false;

  displayedDrawings = [];
  loadProfile: boolean = false;
  isLoaded: boolean = false;

  // to determine from which drawing to which drawing we display
  minDrawing: number = 0;
  maxDrawing: number = 10;
  title: string;

  constructor(
    private modalService: ModalService,
    private httpClientService: HttpClientService,
    public authService: AuthentificationService,
    public profileService: ProfileService,
    public themeService: ThemeService,
    public sanitizer: DomSanitizer,
    public translate: TranslateService
  ) {}

  async ngOnInit() {
    // to allow some time for variables to change
    setTimeout(() => {
      this.loadProfile = true;
    }, 200);

    this.themeService.toggle();
    await this.profileService.getCurrentUserInfo();

    this.profileService.setUserInfo();

    this.isLoaded = await this.profileService.getAlbum().then(() => {
      // initially, if the album contains less than 10 images
      if (this.profileService.album.length < 10) {
        this.maxDrawing = this.profileService.album.length;
      }
      this.sliceAlbum();
      return true;
    });
  }

  gameOutcome(game: IGameHistory): boolean {
    let result = 0;
    let index = game.usersPlayedWith.findIndex(
      (u) => u.username === this.authService.username
    );

    if (index <= 1) return game.scoreClassic[0] > game.scoreClassic[1];
    else return game.scoreClassic[1] > game.scoreClassic[0];
  }

  convertTime(time: number, type: string): string {
    let hrs = ~~(time / 3600);
    let mins = ~~((time % 3600) / 60);
    let secs = ~~time % 60;

    let formattedTime = "";

    if (hrs > 0) formattedTime += "" + hrs + ":";
    else {
      if (type === "hrs") formattedTime += "00:";
    }

    if (type === "hrs") formattedTime += mins < 10 ? "0" : "";

    return (formattedTime +=
      "" + mins + ":" + (secs < 10 ? "0" : "") + "" + secs);
  }

  openEdit() {
    this.modalService.openEdit();
  }

  deleteDrawing(drawing: any, index: number) {
    this.httpClientService.deleteDrawing(drawing.drawing).then((data) => {
      let storageRef = firebase
        .storage()
        .ref("/images/" + this.authService.username);
      let imagesRef = storageRef.child(drawing.drawing);
      imagesRef.delete().catch((error) => {
        console.log(error);
      });
    });

    this.profileService.album.splice(index, 1);
    this.displayedDrawings.splice(index, 1);
    this.sliceAlbum();
    this.profileService.setImageNum();
  }

  sliceAlbum(): void {
    this.displayedDrawings = this.profileService.album.slice(
      this.minDrawing,
      this.maxDrawing
    );
  }

  changePage(event: PageEvent): void {

    if (event.previousPageIndex < event.pageIndex) {
      this.minDrawing += 10;
      this.maxDrawing += 10;

      if (this.profileService.album.length < this.maxDrawing)
        this.maxDrawing = this.profileService.album.length;
    } else {
      this.minDrawing -= 10;

      switch (event.pageIndex) {
        case 0:
          this.maxDrawing = 10;
          break;
        case 1:
          this.maxDrawing = 20;
          break;
        case 2:
          this.maxDrawing = 30;
          break;
        case 3:
          this.maxDrawing = 40;
          break;
        case 4:
          this.maxDrawing = 50;
          break;
      }
    }

    this.sliceAlbum();
  }
}
