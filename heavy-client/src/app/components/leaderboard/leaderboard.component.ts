import { Component, OnInit } from "@angular/core";
import { profilePics } from "src/app/const/profile-pics";
import { IUserInfo } from "../../../../../server/app/interfaces/IUserInfo";
import { HttpParams } from "@angular/common/http";
import { HttpClientService } from "src/app/services/httpClient/http-client.service";
import { AuthentificationService } from "src/app/services/authentification/authentification.service";
import { delay } from "rxjs/operators";
import { ProfileService } from "src/app/services/profile/profile.service";
import { ThemeService } from "src/app/services/theme/theme.service";
import { DomSanitizer } from "@angular/platform-browser";
import { PageEvent } from "@angular/material";
import firebase from "@firebase/app";
import "@firebase/storage";
import { Levels } from "src/app/const/levels";
import { LVL_ACHIEVEMENTS } from "src/app/const/lvl-achievements";
import { ProfilePic } from "src/app/interfaces/profile-pic";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-leaderboard",
  templateUrl: "./leaderboard.component.html",
  styleUrls: ["./leaderboard.component.scss"],
})
export class LeaderboardComponent implements OnInit {
  players: IUserInfo["public"][];
  selectedPlayer: IUserInfo["public"];
  // currentPlayer: IUserInfo;

  rankIndex: number;
  showProfile: boolean;

  minDrawing: number = 0;
  maxDrawing: number = 10;
  album = [];
  displayedDrawings = [];
  isLoaded: boolean = false;
  level: number;
  maxXP: number;
  border: string;
  title: string;
  pointsProgress: number;

  constructor(
    private httpClientService: HttpClientService,
    public profileService: ProfileService,
    public authService: AuthentificationService,
    public themeService: ThemeService,
    private sanitizer: DomSanitizer,
    public translate: TranslateService
  ) {}

  async ngOnInit() {
    this.profileService.getCurrentUserInfo();
    this.themeService.toggle();
    this.showProfile = false;
    await this.sortPlayers();
  }

  async sortPlayers(): Promise<void> {
    let unfilteredPlayers = await this.httpClientService
      .getAllUsersPublic()
      .toPromise();
    let sortedPlayers = unfilteredPlayers.sort(
      (a, b) => b.pointsXP - a.pointsXP
    );
    this.players = sortedPlayers.slice(0, 15);

    if (
      !this.players.some(
        (player) => player.username === this.authService.username
      )
    ) {
      this.players.push(this.profileService.currentUser.public);
      this.rankIndex = sortedPlayers.findIndex(
        (x) => x.username === this.authService.username
      );
    } else
      this.rankIndex = this.players.findIndex(
        (x) => x.username === this.authService.username
      );
  }

  async seeProfile(player: IUserInfo["public"]): Promise<boolean | void> {
    this.selectedPlayer = player;
    this.showProfile = true;

    // reset these variables everytime we change player profiles
    this.isLoaded = false;
    this.displayedDrawings = [];
    this.maxDrawing = this.minDrawing = 0;
    this.border = "";
    this.title = "";

    if (typeof this.selectedPlayer.border !== "undefined")
      this.border = this.selectedPlayer.border;
    if (this.selectedPlayer.title) this.title = this.selectedPlayer.title;

    this.level = Levels.find(
      (o) =>
        this.selectedPlayer.pointsXP >= o.min &&
        this.selectedPlayer.pointsXP <= o.max
    ).level;
    this.maxXP = Levels.find((l) => this.level == l.level).max;

    if (this.level !== 10)
      this.pointsProgress = Math.round(
        (this.selectedPlayer.pointsXP / this.maxXP) * 100
      );
    else this.pointsProgress = 100;

    this.isLoaded = await this.getAlbum().then(() => {
      this.sliceAlbum();
      return true;
    });
  }

  getLevel(xp: number): number {
    return Levels.find((o) => xp >= o.min && xp <= o.max).level;
  }

  async getAlbum() {
    let album = JSON.parse(JSON.stringify(this.selectedPlayer.album));

    this.album = [];
    for (let drawing of album) {
      let storageRef = firebase
        .storage()
        .ref("/images/" + this.selectedPlayer.username);
      let imagesRef = storageRef.child(drawing.drawing);
      await imagesRef.getDownloadURL().then((data) => {
        this.album.push({
          src: data,
          drawing: drawing.drawing,
          word: drawing.word,
        });
      });
    }

    if (this.album.length < 10) this.maxDrawing = this.album.length;
    else this.maxDrawing = 10;
  }

  getAlbumLength(): number {
    let length = 0;
    if (typeof this.selectedPlayer.album !== "undefined") {
      this.selectedPlayer.album.length >= 50
        ? (length = 50)
        : (length = this.selectedPlayer.album.length);
    }
    return length;
  }

  sliceAlbum(): void {
    this.displayedDrawings = this.album.slice(this.minDrawing, this.maxDrawing);
  }

  changePage(event: PageEvent): void {
    if (event.previousPageIndex < event.pageIndex) {
      this.minDrawing += 10;
      this.maxDrawing += 10;

      if (this.album.length < this.maxDrawing)
        this.maxDrawing = this.album.length;
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

  closeProfile() {
    this.showProfile = false;
  }

  findBorder(border: string) {
    if (typeof border === "undefined")
      return "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    return LVL_ACHIEVEMENTS.find((o) => o.border.name == border).border.src;
  }
}
