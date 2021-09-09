import { json } from "body-parser";
import * as http from "http";
import { inject, injectable } from "inversify";
import { FilterQuery, MatchKeysAndValues } from "mongodb";
import * as socketio from "socket.io";
import { IMessageContent } from "../../IMessageContent";
import { IUser } from "../../IUser";
import { Application } from "./app";
import { DatabaseService } from "./services/database.service";
import Types from "./types";

@injectable()
export class Server {
  private readonly appPort: string | number | boolean = this.normalizePort(
    process.env.PORT || "3000"
  );
  private readonly baseDix: number = 10;
  private server: http.Server;
  private io: socketio.Server;

  public constructor(@inject(Types.Application) private application: Application,
                     @inject(Types.DatabaseService) private databaseService: DatabaseService, ) { }

  public init(): void {
    this.application.app.set("port", this.appPort);
    this.server = http.createServer(this.application.app);

    this.io = new socketio.Server(this.server);
    this.socketListen();

    this.server.listen(this.appPort);
    this.server.on("error", (error: NodeJS.ErrnoException) => this.onError(error));
    this.server.on("listening", () => this.onListening());
    }

    // tslint:disable: max-func-body-length
  private socketListen(): void {
        this.io.on('connection', (socket: socketio.Socket) => {
            console.log('A user has connected.');

            // listening and sending username to display from heavy-client
            socket.on("user-joined", (user: any) => {
                const username: string = JSON.parse(user).username;
                console.log("Connected user : " + username);
                this.io.emit("user-joined",  username);
                this.databaseService.collection.findOneAndUpdate({username: username } as FilterQuery<String>, {$set: { socketId: socket.id } as unknown as MatchKeysAndValues<String>});
            });

            // user disconnect from logout
            socket.on("logout", (user: any) => {
              console.log('logout');
                // tslint:disable-next-line: typedef
              this.databaseService.collection.findOneAndDelete({ username: JSON.parse(user).username } as unknown as FilterQuery<string>).then((deleted) => {
                    if (deleted.value != null) {
                        console.log(JSON.parse(user).username + " has disconnected");
                        this.io.emit("logout", JSON.parse(user).username);
                    } else {
                        console.log('No user found to disconnect');
                        this.io.emit("user-disconnected-error");
                    }
                })
                .catch((error: Error) => {
                    console.log('ERROR ' + error);
                });
            });

            // listening and sending messages to display for light-client
            // TODO: Ajouter l'interface message
            socket.on("send-message", (msg: any) => {
                const currentTime = new Date().toLocaleTimeString();
                const msgData = JSON.parse(msg);
                console.log("Client sent: " + JSON.stringify(msgData));
                this.io.emit("send-message", { message: msgData["message"], sender: msgData["sender"], timestamp: currentTime});
            });

            socket.on("disconnect", (result: any) => {
              this.databaseService.collection.findOneAndDelete({ socketId: socket.id } as unknown as FilterQuery<string>).then((deleted) => {
                    if (deleted.value != null) {
                      const username = JSON.parse(JSON.stringify(deleted.value)).username;
                      console.log("deleted:" + username);
                      this.io.emit("logout", username);
                    } else {
                        console.log('No user found to disconnect');
                        this.io.emit("user-disconnected-error");
                    }
                })
                .catch((error: Error) => {
                    console.log('ERROR ' + error);
                });
            });
        });
    }

  private normalizePort(val: number | string): number | string | boolean {
    const port: number =
      typeof val === "string" ? parseInt(val, this.baseDix) : val;
    if (isNaN(port)) {
      return val;
    } else if (port >= 0) {
      return port;
    } else {
      return false;
    }
  }

  private onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== "listen") {
      throw error;
    }
    const bind: string =
      typeof this.appPort === "string"
        ? "Pipe " + this.appPort
        : "Port " + this.appPort;
    switch (error.code) {
      case "EACCES":
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Se produit lorsque le serveur se met à écouter sur le port.
   */
  // private  onListening(): void {
  //     const addr: string | AddressInfo = this.server.address();
  //     const bind: string = (typeof addr === "string") ? `pipe ${addr}` : `port ${addr.port}`;
  //     // tslint:disable-next-line:no-console
  //     console.log(`Listening on ${bind}`);
  // }
  private onListening(): void {
    // tslint:disable-next-line: typedef
    const addr = this.server.address();
    // tslint:disable-next-line:no-non-null-assertion
    const bind: string =
      // tslint:disable-next-line: no-non-null-assertion
      typeof addr === "string" ? `pipe ${addr}` : `port ${addr!.port}`;
    // tslint:disable-next-line:no-console
    console.log(`Listening on ${bind}`);
  }
}
