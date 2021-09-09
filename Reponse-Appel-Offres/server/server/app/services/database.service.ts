import { injectable } from 'inversify';
import { Collection, FilterQuery, MongoClient, MongoClientOptions} from 'mongodb';
import { IResponse } from '../../../IResponse'
import 'reflect-metadata';
import { IUser } from '../../../IUser';
import { Status } from '../../../Status';

// tslint:disable-next-line: typedef
const DATABASE_NAME = 'PROJET3';
// tslint:disable-next-line: typedef
const DATABASE_COLLECTION = 'CONNECTED-USERS';

@injectable()
export class DatabaseService {

    public collection: Collection<String>;

    // tslint:disable-next-line: typedef 2 tslint type def et string inferred si DATABASE_URL : string = X;
    public DATABASE_URL = 'mongodb+srv://admin:lesDINDONS@cluster0.xvsij.mongodb.net/test?retryWrites=true&w=majority';

    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    public constructor() {
        this.startConnection();
    }

    public startConnection(): void {

        // start DB for connected users.
        MongoClient.connect(this.DATABASE_URL, this.options)
            .then((client: MongoClient) => {
                this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
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

    public async addUsername(user: any): Promise<IResponse> {

        let userToAdd = await this.getUsername(user);
        console.log("getUsernameResponse for user:" + user + " : " + userToAdd);
        
        if (userToAdd == null) {
            return this.collection.insertOne(JSON.parse(user)).then(() => {
                const response : IResponse = { status: Status.HTTP_CREATED, message: "User added"};
                return response;
            })
            .catch((error: Error) => {
                throw error;
            });
        }
        
        const res: IResponse = { status: Status.USER_EXISTS, message: "User already exists"}
        console.log('already exists');
        return res;
    }

    public async getAllUsernames(): Promise<string[]> {
        return this.collection.find({}).toArray()
            .then((usernames: string[]) => {
                return usernames;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async getUsername(user: any): Promise<any> {
        return this.collection.findOne({ username: JSON.parse(user).username } as unknown as FilterQuery<string>)  // filter pour username
                .then((user: any) => {
                    return user;
                })
                .catch((error: Error) => {
                    throw error;
                });

    }
}
