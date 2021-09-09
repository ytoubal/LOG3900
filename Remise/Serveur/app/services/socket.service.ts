import * as http from "http";
import { inject, injectable } from "inversify";
import * as socketio from "socket.io";
import Types from "../types";
import { ChatService } from "./chat.service";
import { DrawingService } from "./drawing.service";
import { GameService } from "./game.service";
import { LobbyService } from "./lobby.service";
import { RoomService } from "./room.service";
import { WordImageService } from "./wordImage.service";

@injectable()
export class SocketService {

    private io: socketio.Server;
    public constructor(@inject(Types.ChatService) private chatService: ChatService, @inject(Types.DrawingService) private drawingService: DrawingService,           
                        @inject(Types.RoomService) private roomService: RoomService, @inject(Types.LobbyService) private lobbyService: LobbyService,
                        @inject(Types.GameService) private gameService: GameService, @inject(Types.WordImageService) private wordImageService: WordImageService) {}

    public initSocket(server: http.Server) : void {

        this.io = new socketio.Server(server);

        //initialize all socket services (game stroke, chat, etc)
        this.chatService.initSocket(this.io);
        this.drawingService.initSocket(this.io);
        this.roomService.initSocket(this.io);
        this.lobbyService.initSocket(this.io);
        this.gameService.initSocket(this.io);
        this.wordImageService.initSocket(this.io);
        
        this.chatService.socketListen();
        this.drawingService.socketListen();
        this.roomService.socketListen();
        this.lobbyService.socketListen();
        this.gameService.socketListen();
        this.wordImageService.socketListen();
    }

    // public socketListen() {
    //     // do all socket listening in socket.service and calling other service methods.
    // }
}
