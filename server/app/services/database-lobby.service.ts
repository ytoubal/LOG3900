import { injectable } from "inversify";
import {
  Collection,
  FilterQuery,
  FindOneOptions,
  MatchKeysAndValues,
  MongoClient,
  MongoClientOptions,
} from "mongodb";
import { IResponse, Status } from "../interfaces/IResponse";

// tslint:disable-next-line: typedef
const DATABASE_NAME = "PROJET3";
// tslint:disable-next-line: typedef
const DATABASE_COLLECTION = "LOBBIES";

@injectable()
export class DatabaseLobbyService {
  public collection: Collection<String>;

  // tslint:disable-next-line: typedef 2 tslint type def et string inferred si DATABASE_URL : string = X;
  public DATABASE_URL =
    "mongodb+srv://admin:lesDINDONS@cluster0.xvsij.mongodb.net/test?retryWrites=true&w=majority";

  private options: MongoClientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  public constructor() {
    this.startConnection();
  }

  public startConnection(): void {
    MongoClient.connect(this.DATABASE_URL, this.options)
      .then((client: MongoClient) => {
        this.collection = client
          .db(DATABASE_NAME)
          .collection(DATABASE_COLLECTION);
        if (process.env.NODE_ENV === "test") {
          // tslint:disable-next-line: no-floating-promises
          client.close();
        }
      })
      .catch(() => {
        console.error("CONNECTION ERROR. EXITING PROCESS");
        process.exit(1);
      });
  }

  public async addLobby(lobby: any): Promise<IResponse> {
    const lobbyToAdd = await this.getLobbyByName(lobby);

    if (lobbyToAdd == null) {
      return this.collection
        .insertOne(JSON.parse(lobby))
        .then(() => {
          const response: IResponse = {
            status: Status.HTTP_CREATED,
            message: "Lobby created",
          };
          return response;
        })
        .catch((error: Error) => {
          throw error;
        });
    }

    const res: IResponse = {
      status: Status.USER_EXISTS,
      message: "Lobby already exists",
    };
    console.log("lobby already exists");
    return res;
  }

  public async getLobbyByName(lobby: any): Promise<any> {
    return this.collection
      .findOne(({
        name: JSON.parse(lobby).name,
      } as unknown) as FilterQuery<string>) // filter pour username
      .then((lobby: any) => {
        return lobby;
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  public async getAllLobbies(): Promise<any> {
    return this.collection
      .find(
        {},
        { projection: { _id: 0, name: 1, difficulty: 1, owner: 1, users: 1, rounds: 1 } }
      )
      .toArray()
      .then((lobbies: []) => {
        return lobbies;
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  public async getLobbyUsers(lobby: any): Promise<any> {
    console.log('get lobby users')
    let res: IResponse = {
      status: Status.LOBBY_JOINED,
      message: "Lobby joined",
    };
    return this.collection
      .findOne(
        ({ name: JSON.parse(lobby).name } as unknown) as FilterQuery<string>,
        { projection: { _id: 0, users: 1 } }
      )
      .then((users) => {
        const length = JSON.parse(JSON.stringify(users)).users.length;
        if (length >= 4) {
          res = { status: Status.MAXIMUM_USERS, message: "Lobby is full" };
          return res;
        } else {
          res.message = users ? JSON.stringify(JSON.parse(JSON.stringify(users)).users) : "[]";
          console.log('add uiser dans database lobby service')
          this.collection.findOneAndUpdate(
            { name: JSON.parse(lobby).name } as FilterQuery<String>,
            { $addToSet: ({ users: JSON.parse(lobby).user } as unknown) as undefined }
          );
          return res;
        }
      })
      .catch((error: Error) => {
        res.message = 'The lobby has been deleted';
        res.status = Status.HTTP_NOT_FOUND;
        return res;
      });
  }

  public async getLobbyPlayersDisplay(lobby: any): Promise<any> {
    //console.log(JSON.parse(lobby).name);
    return this.collection
      .findOne(
        ({ name: JSON.parse(lobby).name } as unknown) as FilterQuery<string>,
        { projection: { _id: 0, users: 1 } }
      )
      .then((users) => {
        console.log(users);
        return users;
      })
      .catch((error: Error) => {
        throw error;
      });
  }
}
