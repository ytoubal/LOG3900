import { inject, injectable } from "inversify";
import { Collection, FilterQuery, MatchKeysAndValues, MongoClient, MongoClientOptions } from "mongodb";
import * as socketio from "socket.io";
import Types from "../types";
import { DatabaseRoomService } from "./database-room.service";
import { DatabaseUserService } from "./database-user.service";

@injectable()
export class ChatService {

    private io: socketio.Server;
    public collectionRooms: Collection<String>;
    public collectionUsers: Collection<String>;
    private room: any;
    private usersGeneralSocket: Map<string, string> = new Map<string, string>()
    //private connection: string;

    public constructor(@inject(Types.DatabaseUserService) private databaseUserService: DatabaseUserService, 
                        @inject(Types.DatabaseRoomService) private databaseRoomService: DatabaseRoomService,) {
    }

    public initSocket(io: socketio.Server) : void { 
        this.io = io;
    }
    
    // tslint:disable: max-func-body-length
    public socketListen(): void {
        
        this.io.on('connection', (socket: socketio.Socket) => {
            
            this.collectionRooms = this.databaseRoomService.collection;
            this.collectionUsers = this.databaseUserService.collection;

            this.roomConnection(socket);
            this.userJoin(socket);
            this.sendMessage(socket);
            this.userLogout(socket);
            this.userDisconnect(socket);
        });
    }

    // public deleteRoom(socket: socketio.Socket): void {
    //     socket.on("delete-room", (room: any) => {    //receive userRoom
    //     console.log("room deleted : " + room);
    //     this.collection.findOneAndDelete({name: room } as FilterQuery<String>);
    //     });
    // }

    public roomConnection(socket: socketio.Socket) : void {
        socket.on("room-joined", (response: any) => {
            socket.join(response);
        })
    }

    
    public userJoin(socket: socketio.Socket) : void {

        socket.on("user-joined", (usernameRoom: any) => {    //receive userRoom
            const username: string = JSON.parse(usernameRoom).username;
            const room = JSON.parse(usernameRoom).room;
            if (room == "General") {
                console.log("connection: " + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + " " + JSON.stringify(usernameRoom) + " " + socket.id);

                this.usersGeneralSocket.set(socket.id, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString());

                console.log("User : " + username + " has connected");
                this.collectionUsers.findOneAndUpdate({'connection.username': username } as FilterQuery<String>, 
                                                                {$set: { 'connection.socketId': socket.id } as unknown as MatchKeysAndValues<String>});
            }
            socket.join(room);
            this.io.in(room).emit("user-joined", { username, room});
            this.collectionUsers.findOneAndUpdate({'public.username': username} as unknown as FilterQuery<string>, {$addToSet: { 'connection.rooms': room } as unknown as undefined});

        });
    }

    public sendMessage(socket: socketio.Socket) : void {

        socket.on("send-message", (msg: any) => {
            const currentTime = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
            const msgData = JSON.parse(msg);
            console.log("Client sent: " + JSON.stringify(msgData));
            this.io.in(msgData.room).emit("send-message", { message: msgData["message"], sender: msgData["sender"], timestamp: currentTime, room: msgData["room"], avatar: msgData["avatar"]});
            this.collectionRooms.findOneAndUpdate({name : msgData.room} as unknown as FilterQuery<string>, 
                                            {$addToSet: { history: { message: msgData["message"], sender: msgData["sender"], timestamp: currentTime, avatar: msgData["avatar"] } } as unknown as undefined} );
        });
    }

    public userLogout(socket: socketio.Socket) : void {

        socket.on("logout", (username: string) => { //receive username as string
            console.log("logout ", socket.id + " "+ this.usersGeneralSocket.has(socket.id));
            if (this.usersGeneralSocket.has(socket.id)) {

                console.log('logout');
                this.collectionUsers.findOneAndUpdate({'connection.username': JSON.parse(username)} as unknown as FilterQuery<string>, 
                                                                {$set: {'connection.isConnected': false} as unknown as MatchKeysAndValues<String>})
                .then((original) => {
                    if (original.value != null) {
                        let connectionHistory = [this.usersGeneralSocket.get(socket.id), new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()];
                        this.usersGeneralSocket.delete(socket.id);
                        this.collectionUsers.findOneAndUpdate({'public.username': JSON.parse(username)} as unknown as FilterQuery<string>, {$addToSet: {'private.connections': connectionHistory} as unknown as undefined})
                        .catch((error) => {
                            console.log(error);
                        })
                        console.log(JSON.parse(username) + " has logout/disconnected");
                        socket.broadcast.emit("logout", JSON.parse(username));
                        this.io.emit("self-logout");
                        
                    } else {
                        console.log('No user found to disconnect');
                        this.io.emit("user-disconnected-error");
                    }
                })
                .catch((error: Error) => {
                    console.log('ERROR ' + error);
                });
            }
        });
    }

    public userDisconnect(socket: socketio.Socket) : void {

        socket.on("disconnect", (empty: any) => {  
            console.log("disconect: ", socket.id + " " + this.usersGeneralSocket)
            if (this.usersGeneralSocket.has(socket.id)) {
                console.log('disconnect ' + socket.id);
                this.collectionUsers.findOneAndUpdate({'connection.socketId': socket.id } as unknown as FilterQuery<string>, 
                                                {$set: {'connection.isConnected': false} as unknown as MatchKeysAndValues<String>})
                .then((disconnectedUser) => {
                    if (disconnectedUser.value != null) {
                        console.log(this.usersGeneralSocket + " " + socket.id)
                        
                        let username = JSON.parse(JSON.stringify(disconnectedUser.value)).connection.username;
                        let connectionHistory = [this.usersGeneralSocket.get(socket.id), new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()];
                        this.usersGeneralSocket.delete(socket.id);
                        this.collectionUsers.findOneAndUpdate({'public.username': username} as unknown as FilterQuery<string>, {$addToSet: {'private.connections': connectionHistory} as unknown as undefined})
                        .catch((error) => {
                            console.log(error);
                        })
                        console.log(username + " has disconnected with userDisconnect()");
                        this.io.emit("logout", username);
                        
                    } else {
                        console.log('No user found to disconnect');
                        this.io.emit("user-disconnected-error");
                    }
                })
                .catch((error: Error) => {
                    console.log('ERROR ' + error);
                });
            }
        });
    }

}
