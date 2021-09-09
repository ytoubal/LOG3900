import { Injectable } from "@angular/core";
import { io, Socket } from "socket.io-client/build/index";
import { DATABASE_URL } from "src/app/const/database-url";
import { AuthentificationService } from "../authentification/authentification.service";
import { RoomService } from "../room/room.service";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  message: string;
  sockets: Socket[] = [];

  constructor(private authService: AuthentificationService, private roomService: RoomService) {}

  setUpSocketConnection(room: string) {
    let socket = io(DATABASE_URL, {
      transports: ["websocket", "polling", "flashsocket"],
    });
    this.sockets[room] = socket;

    this.sockets[room].emit(
      "user-joined",
      JSON.stringify({ username: this.authService.username, room })
    );
  }

  resetSetup(room: string) {
    this.sockets[room].off('delete-room');
    this.sockets[room].off('quit-room');
    this.sockets[room].off('send-message');
    this.sockets[room].off('user-disconnected-error');
  }

  resetAllConnections() {
    for (let room of this.roomService.userRooms) {
      this.sockets[room].disconnect();
    }
    this.sockets = [];
    this.roomService.userRooms = [];
  }
}
