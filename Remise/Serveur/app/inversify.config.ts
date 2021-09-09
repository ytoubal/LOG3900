import { Container } from "inversify";
import { Application } from "./app";
import { DatabaseController } from './controllers/database.controller';
import { Server } from "./server";
import { ChatService } from "./services/chat.service";
import { DatabaseGameService } from "./services/database-game.service";
import { DatabaseLobbyService } from "./services/database-lobby.service";
import { DatabaseRoomService } from "./services/database-room.service";
import { DatabaseUserService } from "./services/database-user.service";
import { DatabaseWordImageService } from "./services/database-wordImage.service";
import { DrawingService } from "./services/drawing.service";
import { GameService } from "./services/game.service";
import { LobbyService } from "./services/lobby.service";
import { RoomService } from "./services/room.service";
import { SocketService } from "./services/socket.service";
import { WordImageService } from "./services/wordImage.service";
import Types from "./types";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.DatabaseUserService).to(DatabaseUserService);
container.bind(Types.DatabaseController).to(DatabaseController);
container.bind(Types.ChatService).to(ChatService);
container.bind(Types.DrawingService).to(DrawingService);
container.bind(Types.RoomService).to(RoomService);
container.bind(Types.LobbyService).to(LobbyService);
container.bind(Types.GameService).to(GameService);
container.bind(Types.WordImageService).to(WordImageService);
container.bind(Types.SocketService).to(SocketService);
container.bind(Types.DatabaseRoomService).to(DatabaseRoomService);
container.bind(Types.DatabaseLobbyService).to(DatabaseLobbyService);
container.bind(Types.DatabaseGameService).to(DatabaseGameService);
container.bind(Types.DatabaseWordImageService).to(DatabaseWordImageService);

export { container };
