import { injectable } from 'inversify';
import { Collection, FilterQuery, FindOneOptions, MatchKeysAndValues, MongoClient, MongoClientOptions} from 'mongodb';
import { IResponse, Status } from '../interfaces/IResponse';
import 'reflect-metadata';


// tslint:disable-next-line: typedef
const DATABASE_NAME = 'PROJET3';
// tslint:disable-next-line: typedef
const DATABASE_COLLECTION_ROOMS = 'ROOMS';

@injectable()
export class DatabaseRoomService {

    public collection: Collection<String>;
    public collectionUsers: Collection<String>;

    // tslint:disable-next-line: typedef 2 tslint type def et string inferred si DATABASE_URL : string = X;
    public DATABASE_URL = 'mongodb+srv://admin:lesDINDONS@cluster0.xvsij.mongodb.net/test?retryWrites=true&w=majority';

    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        connectTimeoutMS: 10000,
    };

    public constructor() {
        this.startConnection();

    }

    public startConnection(): void {

        // start DB for connected users.
        MongoClient.connect(this.DATABASE_URL, this.options)
            .then((client: MongoClient) => {
                this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION_ROOMS);

                console.log('ROOM database STARTCONNECT called')

                // this.collectionUsers = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION_USERS);
                if (process.env.NODE_ENV === 'test') {
                    // tslint:disable-next-line: no-floating-promises
                    client.close();
                }
            })
            .catch(() => {
                console.error('CONNECTION ERROR. EXITING PROCESS');
                process.exit(1);
            });
    }

    public async getRoom(room: any): Promise<any> {
        return this.collection.findOne({ name: JSON.parse(room).name} as unknown as FilterQuery<string>)  // filter pour username
                .then((room: any) => {
                    return room;
                })
                .catch((error: Error) => {
                    throw error;
                });

    }

    public async addRoom(room: any): Promise<IResponse> {
        const roomToAdd = await this.getRoom(room);
        if (roomToAdd == null) {
            return this.collection.insertOne(JSON.parse(room)).then(() => {
                const response: IResponse = { status: Status.HTTP_CREATED, message: "Room added"};
                return response;
            })
            .catch((error: Error) => {
                throw error;
            });
        }
        
        const res: IResponse = { status: Status.USER_EXISTS, message: "Room already exists"};
        console.log('room already exists');
        return res;
    }

    public async joinRoom(user: any): Promise<IResponse> {
        const existingRoom = await this.getRoom(user);
        if (existingRoom == null) {
            const res: IResponse = { status: Status.HTTP_NOT_FOUND, message: "Room doesn't exist"};
            return res;
        }
        else {
            this.collectionUsers.findOneAndUpdate({'public.username': JSON.parse(user).username} as unknown as FilterQuery<string>, {$addToSet: { 'connection.rooms': JSON.parse(user).name } as unknown as undefined});
            const res: IResponse = { status: Status.USER_EXISTS, message: "Login successful"};
            return res;
        }
    }

    public async quitRoom(user: any): Promise<IResponse> {
        this.collectionUsers.findOneAndUpdate({'public.username': JSON.parse(user).username} as unknown as FilterQuery<string>, {$pull: { 'connection.rooms': JSON.parse(user).room } as unknown as undefined});
        const res: IResponse = { status: Status.USER_EXISTS, message: "Login successful"};
        return res;

    }

    public async getHistoryRoom(room: any): Promise<any> {
        return this.collection.findOne({name: JSON.parse(room).name} as FilterQuery<String>, { projection: { history: 1, _id: 0} as FindOneOptions<any>})
            .then((history: any) => {
                return history;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getAllRooms(): Promise<any> {
        // return this.collection.find({}).toArray()
        return this.collection.find({}, {projection: {_id: 0, name: 1, history : 1, admin : 1}}).toArray()
            .then((rooms: []) => {
                return rooms;
            })
            .catch((error: Error) => {
                throw error;
            });
    } 
}
