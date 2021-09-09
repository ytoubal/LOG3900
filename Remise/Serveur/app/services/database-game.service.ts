import { injectable } from "inversify";
import { Collection, FilterQuery, MongoClient, MongoClientOptions } from "mongodb";
import { IResponse, Status } from "../interfaces/IResponse";

// tslint:disable-next-line: typedef
const DATABASE_NAME = "PROJET3";
// tslint:disable-next-line: typedef
const DATABASE_COLLECTION = "GAMES";

@injectable()
export class DatabaseGameService {

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

  public async addGame(game: any): Promise<IResponse> {
    const gameToAdd = await this.getGameByHost(game);

    
    const jsonRoles = JSON.parse(JSON.parse(JSON.stringify(gameToAdd)).helper_roles);  // {"nhien":"human1Guess","bob":"human1Draw"}

    let map = new Map<string, string>()  
    for (var value in jsonRoles) {  
      map.set(value, jsonRoles[value])  
    }  

    for (const [key, value] of map.entries()) {
      console.log(key, value);
    }

    console.log(map.keys());
    console.log(map.values());

    if (gameToAdd == null) {
      console.log(game);
      return this.collection.insertOne(JSON.parse(game)).then(() => {
        const response: IResponse = { status: Status.HTTP_CREATED, message: "Game created"};
        return response;
      })
      .catch((error: Error) => {
        throw error;
      });
    }
    
    const res: IResponse = { status: Status.USER_EXISTS, message: "Game already exists"};
    console.log('lobby already exists');
    return res;
  }

  public async getGameByHost(game : any) : Promise<any> {
    return this.collection.findOne({'host' : 'nhien' } as unknown as FilterQuery<string>)  // filter pour username
    .then((game: any) => {
      return game;
    })
    .catch((error: Error) => {
      throw error;
    });
  }

  // public async addMap() : Promise<any> {

  //   BasicDBObject doc = new BasicDBObject();
  //   BasicDBObject

  // }



}
