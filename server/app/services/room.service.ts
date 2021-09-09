import { inject, injectable } from "inversify";
import { Collection, FilterQuery, UpdateManyOptions } from "mongodb";
import * as socketio from "socket.io";
import Types from "../types";
import { DatabaseRoomService } from "./database-room.service";
import { DatabaseUserService } from "./database-user.service";
@injectable()
export class RoomService {

    private io: socketio.Server;
    public collectionRooms: Collection<String>;
    public collectionUsers: Collection<String>;

    public constructor(@inject(Types.DatabaseUserService) private databaseUserService: DatabaseUserService,
                        @inject(Types.DatabaseRoomService) private databaseRoomService: DatabaseRoomService,) {}

    public initSocket(io: socketio.Server) : void { 
        this.io = io;
    }

    public socketListen(): void {

        this.io.on('connection', (socket: socketio.Socket) => {
            
            this.collectionUsers = this.databaseUserService.collection;
            this.collectionRooms = this.databaseRoomService.collection;
            this.deleteRoom(socket);
            this.quitRoom(socket);
        });
    }

    public deleteRoom(socket: socketio.Socket): void {
        socket.on("delete-room", (room: any) => {    //receive userRoom
            console.log("room deleted : " + room);
            this.collectionUsers.updateMany({'connection.rooms': {$in : [room]}} as FilterQuery<String>, {$pull: { 'connection.rooms': room } as unknown as undefined}, {multi: true} as UpdateManyOptions);
            this.collectionRooms.findOneAndDelete({name: room} as FilterQuery<String>);
            this.io.in(room).emit("delete-room", room);
        });
    }

    public quitRoom(socket: socketio.Socket): void {
        socket.on("quit-room", (user: any) => {
            this.collectionUsers.findOneAndUpdate({'public.username': JSON.parse(user).username} as unknown as FilterQuery<string>, {$pull: { 'connection.rooms': JSON.parse(user).room } as unknown as undefined});
            this.io.in(JSON.parse(user).room).emit("quit-room");
            // socket.emit("quit-room");
        })
    }


    // public deleteRoom(socket: socketio.Socket): void {
    //     socket.on("delete-room", (room: any) => {    //receive userRoom
    //         console.log("room deleted : " + room);
    //         this.databaseUserService.collection.updateMany({'connection.rooms': {$in : [room]}} as FilterQuery<String>,
    //              {$pull: { 'connection.rooms': room } as unknown as undefined}, {multi: true} as UpdateManyOptions);
    // });
    // }

    // public quitRoom(socket: socketio.Socket): void {
    //     socket.on("quit-room", (user: any) => {
    //         this.databaseUserService.collection.findOneAndUpdate({'public.username': JSON.parse(user).username} as unknown as FilterQuery<string>, 
    //             {$pull: { 'connection.rooms': JSON.parse(user).room } as unknown as undefined});
    //     })
    // }
}
