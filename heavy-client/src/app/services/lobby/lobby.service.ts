import { Injectable } from '@angular/core';
import { IUserInfo } from '../../../../../server/app/interfaces/IUserInfo';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { AuthentificationService } from '../authentification/authentification.service';
import { ILobby } from '../../../../../server/app/interfaces/ILobby';
import { IResponse } from '../../../../../server/app/interfaces/IResponse';
import { Router } from '@angular/router';
import { SnackbarService } from '../snackbar/snackbar.service';
import { DATABASE_URL } from 'src/app/const/database-url';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "my-auth-token",
  }),
};

@Injectable({
  providedIn: 'root'
})
export class LobbyService {

  name : string;
  owner : string;
  difficulty: string;
  users: IUserInfo['public'][];
  players: any[] = [];
  position: number;
  team: any[] = [];
  team1: any[] = [];
  team2: any[] = [];
  rounds: number;

  constructor(
    public http: HttpClient,
    private router: Router,
    private snackbarService: SnackbarService,
    private authService: AuthentificationService
  ) { }

  async getUserRooms() {
    const params = new HttpParams().set("username", this.authService.username); // Create new HttpParams
    return this.http
      .get(URL + "/database/user-rooms", { params })
      .subscribe((data) => {
        for (let element of JSON.parse(JSON.stringify(data)).rooms) {
          console.log(element);
        }
      });
  }


  async getLobbies() {
    return this.http
      .get(URL + "/database/all-lobbies")
      .subscribe((data) => {
        for (let element of JSON.parse(JSON.stringify(data))) {
          console.log(element)
          element.name;
        }
      });
  }

}
