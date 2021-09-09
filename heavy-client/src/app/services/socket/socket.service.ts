import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { DATABASE_URL } from 'src/app/const/database-url';
import { AuthentificationService } from '../authentification/authentification.service';
import { LobbyService } from '../lobby/lobby.service';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: Socket;
  constructor(private lobbyService: LobbyService, private authService: AuthentificationService) { }

  public setUpSocketConnection(): void {

    this.socket = io(DATABASE_URL, {
      transports: ["websocket", "polling", "flashsocket"],

      
    });

  }
}
