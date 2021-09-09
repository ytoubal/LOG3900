import { inject, injectable } from "inversify";
import {
  Collection,
  FilterQuery,
  FindOneOptions,
  MatchKeysAndValues,
  MongoClient,
  MongoClientOptions,
  UpdateManyOptions,
} from "mongodb";
import * as socketio from "socket.io";
import { isThisTypeNode } from "typescript";
import Types from "../types";
import { DatabaseLobbyService } from "./database-lobby.service";
import { DatabaseWordImageService } from "./database-wordImage.service";
import firebase from "firebase/app";

// These imports load individual services into the firebase namespace.
import "firebase/auth";
import "firebase/database";
import { DatabaseUserService } from "./database-user.service";

@injectable()
export class LobbyService {
  private io: socketio.Server;
  public DATABASE_URL =
    "mongodb+srv://admin:lesDINDONS@cluster0.xvsij.mongodb.net/test?retryWrites=true&w=majority";
  public constructor(
    @inject(Types.DatabaseLobbyService)
    private databaseLobbyService: DatabaseLobbyService,
    @inject(Types.DatabaseWordImageService)
    private databaseWordImageService: DatabaseWordImageService,
    @inject(Types.DatabaseUserService)
    private databaseUserService: DatabaseUserService
  ) {}
  public collection: Collection<String>;
  public usersCollection: Collection<String>;
  private usersLobbySocket: Map<string, [string, string]> = new Map<
    string,
    [string, string]
  >();

  private options: MongoClientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  public initSocket(io: socketio.Server): void {
    this.io = io;
  }

  public socketListen(): void {
    this.io.on("connection", (socket: socketio.Socket) => {
      this.collection = this.databaseLobbyService.collection;
      this.usersCollection = this.databaseUserService.collection;

      this.joinLobby(socket);
      this.quitLobby(socket);
      this.deleteLobby(socket);
      this.startGame(socket);
      this.joinTeam(socket);
      this.teamsInfo(socket);
      this.userDisconnect(socket);
    });
  }

  public userDisconnect(socket: socketio.Socket): void {
    socket.on("disconnect", () => {
      console.log('user disconnect');
      if (this.usersLobbySocket.has(socket.id)) {
        console.log(
          this.usersLobbySocket + " " + this.usersLobbySocket.get(socket.id)
        );
        this.updateUsersLobby(
          this.usersLobbySocket.get(socket.id)![1],
          this.usersLobbySocket.get(socket.id)![0]
        );
        this.collection.findOne({name: this.usersLobbySocket.get(socket.id)![1]} as FilterQuery<String>, {projection: {_id: 0, owner: 1}})
        .then((data) => {
          if (data) {
            let owner = JSON.parse(JSON.stringify(data)).owner;
            console.log('owner ' + owner);
            console.log(this.usersLobbySocket.get(socket.id)![0]);
            if (owner === this.usersLobbySocket.get(socket.id)![0]) {
              console.log('owner disconnects, delete lobby ' + this.usersLobbySocket.get(socket.id)![1] + " " + owner);
              this.collection.findOneAndDelete({name: this.usersLobbySocket.get(socket.id)![1]} as FilterQuery<String>);
              this.usersCollection.updateMany({'connection.rooms': {$in : ["$$_" + this.usersLobbySocket.get(socket.id)![1] + "_$$"]}} as FilterQuery<String>, {$pull: { 'connection.rooms': "$$_" + this.usersLobbySocket.get(socket.id)![1] + "_$$" } as unknown as undefined}, {multi: true} as UpdateManyOptions)
              .then((error) => {
                console.log(error);
              })

              this.io.in("$$_" + this.usersLobbySocket.get(socket.id)![1] + "_$$").emit("delete-lobby", this.usersLobbySocket.get(socket.id)![1]);
            }
            this.io
              .in("$$_" + this.usersLobbySocket.get(socket.id)![1] + "_$$")
              .emit("quit-lobby", this.usersLobbySocket.get(socket.id)![0]);
            this.usersLobbySocket.delete(socket.id);
          }
        })
        .catch((error) => {
          console.log(error);
        })
      }
    });
  }

  public joinLobby(socket: socketio.Socket): void {
    socket.on("join-lobby", (lobby: any) => {
      //receive userRoom
      console.log("lobby joined : " + lobby);
      const lobbyData = JSON.parse(lobby);
      if (![
        "Botliver",
        "YanisBot",
        "NhienBot",
        "Botlice",
        "YuhanBot",
        "CharlesBot",
      ].includes(lobbyData.user.username)) {
        this.usersLobbySocket.set(socket.id, [
          lobbyData.user.username,
          lobbyData.name,
        ]);
      }
      else {
          this.collection.findOneAndUpdate(
          { name: lobbyData.name } as FilterQuery<String>,
          { $addToSet: ({ users: lobbyData.user } as unknown) as undefined }
        );
      }
      console.log('user joined lobby ' + lobbyData.user.username)
      socket.join("$$_" + lobbyData.name + "_$$");
      this.io
        .in("$$_" + lobbyData.name + "_$$")
        .emit("join-lobby", lobbyData.user);
    });
  }

  public joinTeam(socket: socketio.Socket): void {
    socket.on("join-team", (teamPlayer: any) => {
      //receive userRoom
      console.log("team joined : " + teamPlayer);
      const teamPlayerData = JSON.parse(teamPlayer);
      this.io
        .in("$$_" + teamPlayerData.lobbyName + "_$$")
        .emit("join-team", teamPlayerData);
    });
  }

  public quitLobby(socket: socketio.Socket): void {
    socket.on("quit-lobby", (lobby: any) => {
      const lobbyData = JSON.parse(lobby);
      this.collection.findOneAndUpdate(
        { name: lobbyData.name } as FilterQuery<String>,
        { $pull: ({ users: lobbyData.user } as unknown) as undefined }
      );
      console.log("lobby quit: " + lobby);
      this.io
        .in("$$_" + lobbyData.name + "_$$")
        .emit("quit-lobby", lobbyData.user.username);
    });
  }

  public updateUsersLobby(name: string, user: string): void {
    console.log(name);
    console.log(user);
    this.collection.findOneAndUpdate({ name: name } as FilterQuery<String>, {
      $pull: ({ users: { username: user } } as unknown) as undefined,
    });
  }

  public deleteLobby(socket: socketio.Socket): void {
    socket.on("delete-lobby", (lobby: any) => {
      this.collection.findOneAndDelete({ name: lobby } as FilterQuery<String>);
      console.log("delete lobby: " + lobby);
      this.io.in("$$_" + lobby + "_$$").emit("delete-lobby", lobby);
    });
  }

  public startGame(socket: socketio.Socket): void {
    socket.on("start-game", (lobby: any) => {
      console.log("start-game: " + lobby);
      const name = JSON.parse(lobby).name;
      const rounds = JSON.parse(lobby).rounds;
      let ref = firebase.database().ref("/wordImages/");
      let elementsWords: any[] = [];
      let elementsHints: any[] = [];

      ref
        .once("value", (snap) => {
          snap.forEach((item) => {
            //LEGER
            if (item.val().difficulty === JSON.parse(lobby).difficulty) {
              elementsWords.push(item.val().word);
              elementsHints.push(item.val().hints);
            }
          });
        })
        .then(() => {
          let words: any[] = [];
          let hints: any[] = [];
          for (let i = 0; i < rounds; i++) {
            let index = Math.floor(Math.random() * elementsWords.length);
            words[i] = elementsWords[index];
            hints[i] = elementsHints[index];
            elementsWords.splice(index, 1);
            elementsHints.splice(index, 1);
          }
          this.io.in("$$_" + name + "_$$").emit("start-game", words, hints);
        });
      // this.databaseWordImageService.collection.find({}, {projection: {_id: 0, word: 1}}).toArray()  // filter pour username
      // .then((wordImages: any) => {
      //   let array: any[] = [];
      //   for (let i = 0; i < rounds; i++) {
      //     let index = Math.floor(Math.random() * wordImages.length);
      //     array[i] = wordImages[index].word;
      //     wordImages.splice(index, 1);
      //   }
      //   this.io.in(name).emit("start-game", array);
      // });
    });
  }

  public teamsInfo(socket: socketio.Socket): void {
    socket.on("teams-info", (teams: any) => {
      //receive userRoom
      console.log("teams-info");
      // console.log(JSON.stringify(teams));
      // this.io.emit("teams-info", JSON.stringify(teams));
      console.log(JSON.stringify(JSON.parse(teams)));
      this.io.emit("teams-info", JSON.stringify(JSON.parse(teams)));
    });
  }
}
