import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Levels } from "src/app/const/levels";
import { profilePics } from "src/app/const/profile-pics";
import { IUserInfo } from "../../../../../server/app/interfaces/IUserInfo";
import { AuthentificationService } from "../authentification/authentification.service";
import { HttpClientService } from "../httpClient/http-client.service";
import firebase from "@firebase/app";
import "@firebase/storage";
import { LVL_ACHIEVEMENTS } from "src/app/const/lvl-achievements";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  currentUser: IUserInfo;
  gamesPlayed: string;
  gamesWinrate: number;

  totalTime: number;
  averageTime: number;
  level: number;
  pointsXP: number;
  pointsProgress: number;
  maxXP: number;
  title: string;
  border: string;

  album: any[] = [];
  imageNum: number = 0;

  games: any[] = [];
  connections: any[] = [];

  constructor(
    private authService: AuthentificationService,
    private httpClientService: HttpClientService,
    private sanitizer: DomSanitizer
  ) {}

  async getCurrentUserInfo(): Promise<void> {
    const params = new HttpParams().set("username", this.authService.username);
    this.currentUser = await this.httpClientService
      .getUserInfo(params)
      .toPromise();
  }

  greaterThan(first: number, second: number) {
    return first > second;
  }

  findAvatar(name: string): string {
    if (name) return profilePics.find((o) => o.name === name).src;
  }

  findBorder() {
    return LVL_ACHIEVEMENTS.find((o) => o.border.name === this.border).border
      .src;
  }

  setUserInfo() {
    this.authService.fName = this.currentUser.private.firstName;
    this.authService.lName = this.currentUser.private.lastName;
    this.title = this.currentUser.public.title;
    this.border = this.currentUser.public.border;

    //nb parties jouees
    this.gamesPlayed = this.currentUser.private.gameStats.gamesPlayed + "";

    //% victoires
    if (this.currentUser.private.gameStats.gamesPlayed === 0)
      this.gamesWinrate = 0;
    else {
      this.gamesWinrate = Math.round(
        (this.currentUser.private.gameStats.gamesWon /
          this.currentUser.private.gameStats.gamesPlayed) *
          100
      );
    }

    //temps total
    this.totalTime = this.currentUser.private.gameStats.totalGameTime;
    //temps moyen
    this.averageTime =
      this.totalTime / this.currentUser.private.gameStats.gamesPlayed;

    let games = JSON.parse(
      JSON.stringify(this.currentUser.private.gameStats.allGames)
    );

    this.games = [];
    for (let game of games) {
      this.games.push(game);
    }

    this.games = this.games.reverse();

    this.pointsXP = this.currentUser.public.pointsXP;

    this.level = Levels.find(
      (o) => this.pointsXP >= o.min && this.pointsXP <= o.max
    ).level;

    this.maxXP = Levels.find((l) => this.level == l.level).max;
    this.pointsProgress = Math.round((this.pointsXP / this.maxXP) * 100);

    //les connexions/deconnexions
    this.connections = this.currentUser.private.connections.reverse();
  }

  setImageNum(): void {
    this.album.length >= 50
      ? (this.imageNum = 50)
      : (this.imageNum = this.album.length);
  }

  async getAlbum() {
    if (typeof this.currentUser.public.album !== "undefined") {
      let album = JSON.parse(JSON.stringify(this.currentUser.public.album));

      this.album = [];
      for (let drawing of album) {
        let storageRef = firebase
          .storage()
          .ref("/images/" + this.authService.username);
        let imagesRef = storageRef.child(drawing.drawing);
        await imagesRef.getDownloadURL().then((data) => {
          this.album.push({
            src: data,
            drawing: drawing.drawing,
            word: drawing.word,
          });
        });
      }
    }

    this.setImageNum();
  }
}
