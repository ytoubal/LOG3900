import { inject, injectable } from "inversify";
import { Collection, MongoClient, MongoClientOptions } from "mongodb";
import * as socketio from "socket.io";

@injectable()
export class DrawingService {

    private io: socketio.Server;
    public collection: Collection<String>;

    public initSocket(io: socketio.Server) : void { 
        this.io = io;
    }

    // tslint:disable: max-func-body-length
    public socketListen(): void {
        this.io.on('connection', (socket: socketio.Socket) => {
          this.sendStroke(socket);
        });
    }

    public sendStroke(socket: socketio.Socket) : void {
        socket.on("draw", (response: any) => {
          const name = JSON.parse(response).name;
          socket.to("$$_" + name + "_$$").emit("draw", JSON.parse(response));
          // socket.broadcast.emit("draw", JSON.parse(response));
        })
    }

}
