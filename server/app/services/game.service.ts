import { inject, injectable } from "inversify";
import { Collection, FilterQuery, FindOneAndUpdateOption, UpdateManyOptions } from "mongodb";
import * as socketio from "socket.io";
import Types from "../types";
import { DatabaseGameService } from "./database-game.service";
import { DatabaseUserService } from "./database-user.service";

import {
  angryBot,
  arrogantBot,
  funnyBot,
  intellectualBot,
  niceBot,
} from "../const/bot-msg";
import { IMessageContent } from "../interfaces/IMessageContent";

@injectable()
export class GameService {
  private io: socketio.Server;
  public DATABASE_URL =
    "mongodb+srv://admin:lesDINDONS@cluster0.xvsij.mongodb.net/test?retryWrites=true&w=majority";
  public constructor(
    @inject(Types.DatabaseGameService)
    private databaseGameService: DatabaseGameService,
    @inject(Types.DatabaseUserService)
    private databaseUserService: DatabaseUserService
  ) {}
  public collection: Collection<String>;
  public collectionUsers: Collection<String>;
  private usersGameSocket: Map<string, string> = new Map<string, string>();

  public initSocket(io: socketio.Server): void {
    this.io = io;
  }

  public socketListen(): void {
    this.io.on("connection", (socket: socketio.Socket) => {
      this.collection = this.databaseGameService.collection;
      this.collectionUsers = this.databaseUserService.collection;
      this.joinGame(socket);
      this.roundStart(socket);
      this.roundEnd(socket);
      this.gameEnd(socket);
      this.guessWord(socket);
      this.reply(socket);
      this.addGameInfo(socket);
      this.botMsg(socket);
      this.userDisconnect(socket);
      this.stopGame(socket);
    });
  }

  public userDisconnect(socket: socketio.Socket): void {
    socket.on("disconnect", () => {
      console.log("game disconnect: " + this.usersGameSocket.has(socket.id));
      if (this.usersGameSocket.has(socket.id)) {
        console.log("emit stop-game", this.usersGameSocket.get(socket.id)!);
        this.io
          .in("$$_" + this.usersGameSocket.get(socket.id)! + "_$$")
          .emit("stop-game");
        this.collectionUsers.updateMany({'connection.rooms': {$in : ["$$_" + this.usersGameSocket.get(socket.id)! + "_$$"]}} as FilterQuery<String>, {$pull: { 'connection.rooms': "$$_" + this.usersGameSocket.get(socket.id)! + "_$$" } as unknown as undefined}, {multi: true} as UpdateManyOptions)
        .then((error) => {
          console.log(error);
        });

        this.usersGameSocket.delete(socket.id);
      }
    });
  }

  public stopGame(socket: socketio.Socket): void {
    socket.on("stop-game", (game) => {
      console.log("user left game" + game);
      this.io
          .in("$$_" + game + "_$$")
          .emit("stop-game");
    });
  }

  public joinGame(socket: socketio.Socket): void {
    socket.on("join-game", (game: any) => {
      console.log("join game + " + game);
      socket.join("$$_" + game + "_$$");
      this.io.in("$$_" + game + "_$$").emit("join-game");
      this.usersGameSocket.set(socket.id, game);
    });
  }

  public roundStart(socket: socketio.Socket): void {
    socket.on("round-start", (game: any) => {
      console.log("round-start");
      this.io.in("$$_" + game + "_$$").emit("round-start");
    });
  }

  public roundEnd(socket: socketio.Socket): void {
    socket.on("round-end", (game: any) => {
      console.log("round-end");
      this.io.in("$$_" + game + "_$$").emit("round-end");
    });
  }

  public gameEnd(socket: socketio.Socket): void {
    socket.on("game-end", (game: any) => {
      console.log("game-end");
      this.io.in("$$_" + game + "_$$").emit("game-end");
    });
  }

  public guessWord(socket: socketio.Socket): void {
    socket.on("guess-word", (game: any) => {
      const name = JSON.parse(game).name;
      const team = JSON.parse(game).team;
      const guesser = JSON.parse(game).guesser;
      console.log(
        "guess-word et : " +
          JSON.stringify(name) +
          " " +
          JSON.stringify(team) +
          " " +
          JSON.stringify(guesser)
      );
      this.io.in("$$_" + name + "_$$").emit("guess-word", { team, guesser });
    });
  }

  public reply(socket: socketio.Socket): void {
    socket.on("reply", (game: any) => {
      this.io.in("$$_" + game + "_$$").emit("reply");
    });
  }

  public addGameInfo(socket: socketio.Socket): void {
    socket.on("game-info", (game: any) => {
      console.log("game-info " + JSON.stringify(JSON.parse(game)));
      const username = JSON.parse(game).username;
      const match = JSON.parse(game).nbMatches;
      const victories = JSON.parse(game).nbVictories;
      const time = JSON.parse(game).time;
      const mode = JSON.parse(game).mode;
      const score = JSON.parse(game).score;
      const users = JSON.parse(game).users;
      const diff = JSON.parse(game).diff;

      let points = 0;
      if (victories) {
        switch (diff) {
          case "Easy":
            points = 50;
            break;
          case "Medium":
            points = 75;
            break;
          case "Hard":
            points = 100;
            break;
        }
      }

      const history = {
        date: new Date().toLocaleDateString(),
        time,
        gameMode: mode,
        scoreClassic: score,
        usersPlayedWith: users,
        difficulty: diff
      };

      this.collectionUsers
        .findOneAndUpdate(
          { "public.username": username } as FilterQuery<String>,
          {
            $inc: ({
              "private.gameStats.gamesPlayed": 1,
              "private.gameStats.gamesWon": victories,
              "private.gameStats.totalGameTime": time,
              "public.pointsXP": points,
            } as unknown) as undefined,
          }
        )
        .then((data) => {
          console.log('incremented');
          this.collectionUsers.findOneAndUpdate(
            { "public.username": username } as FilterQuery<String>,
            {
              $addToSet: ({
                "private.gameStats.allGames": history,
              } as unknown) as undefined,
            }
          );
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  public botMsg(socket: socketio.Socket): void {
    socket.on("bot-msg", (botInfo: any) => {
      const botData = JSON.parse(botInfo);
      this.io
        .in("$$_" + botData.lobbyName + "_$$")
        .emit(
          "bot-msg",
          this.createBotMsg(botData.state, botData.sender, botData.lobbyName)
        );
    });
  }

  public getBotMsg(name: string, state: number): string {
    let randomMsg = Math.floor(Math.random() * 3); //3 messages in each array
    switch (name) {
      case "Botliver":
        return niceBot[state][randomMsg];
      case "YanisBot":
        return angryBot[state][randomMsg];
      case "NhienBot":
        return funnyBot[state][randomMsg];
      case "Botlice":
        return niceBot[state][randomMsg];
      case "YuhanBot":
        return arrogantBot[state][randomMsg];
      case "CharlesBot":
        return intellectualBot[state][randomMsg];
    }
    return funnyBot[state][randomMsg];
  }

  createBotMsg(state: number, botName: string, lobbyName: string) {
    const message: IMessageContent = {
      message: this.getBotMsg(botName, state).trim(),
      sender: botName,
      timestamp:
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
      room: lobbyName,
      avatar: "virtual_player",
    };
    return message;
  }
}
