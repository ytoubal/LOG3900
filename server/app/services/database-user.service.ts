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
import "reflect-metadata";
import { IUserInfo } from "../interfaces/IUserInfo";

// tslint:disable-next-line: typedef
const DATABASE_NAME = "PROJET3";
// tslint:disable-next-line: typedef
const DATABASE_COLLECTION = "CONNECTED-USERS";

enum Purpose {
  REGISTER = 0,
  LOGIN = 1,
  UPDATE = 2,
}

@injectable()
export class DatabaseUserService {
  public collection: Collection<String>;

  // tslint:disable-next-line: typedef 2 tslint type def et string inferred si DATABASE_URL : string = X;
  public DATABASE_URL =
    "mongodb+srv://admin:lesDINDONS@cluster0.xvsij.mongodb.net/test?retryWrites=true&w=majority";

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
        console.log("USER database STARTCONNECT called");

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

  public async getAll(): Promise<string[]> {
    return this.collection
      .find({})
      .toArray()
      .then((usernames: string[]) => {
        return usernames;
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  public async registerUser(userInfo: any): Promise<IResponse> {
    const userToAdd = await this.getUserByUsername(userInfo, Purpose.REGISTER); //IUserInfo
    console.log("registerUser :" + userInfo + " : " + userToAdd);
    if (userToAdd == null) {
      return this.collection
        .insertOne(JSON.parse(userInfo))
        .then(() => {
          const response: IResponse = {
            status: Status.HTTP_CREATED,
            message: "User added",
          };
          return response;
        })
        .catch((error: Error) => {
          throw error;
        });
    }

    const res: IResponse = {
      status: Status.USER_EXISTS,
      message: "User already exists",
    };
    return res;
  }

  //receives user : contains field username/password only
  public async login(user: any): Promise<IResponse> {
    //TODO: use fonction that search for user's password in database.
    const userInfo = await this.getUserByUserNamePwd(user); // userInfo = [Object Object] no need to parse
    if (userInfo == null) {
      const username = await this.getUserByUsername(user, Purpose.LOGIN);
      if (username == null) {
        const res: IResponse = {
          status: Status.USER_INEXISTENT,
          message: "Username inexistent",
        };
        return res;
      } else {
        const res: IResponse = {
          status: Status.HTTP_NOT_FOUND,
          message: "Username or password incorrect",
        };
        return res;
      }
    } else if (userInfo.connection.isConnected) {
      const res: IResponse = {
        status: Status.USER_ALREADY_CONNECTED,
        message: "User already connected",
      };
      return res;
    } else {
      this.collection.findOneAndUpdate(
        ({
          "connection.username": userInfo.connection.username,
        } as unknown) as FilterQuery<string>,
        {
          $set: ({
            "connection.isConnected": true,
          } as unknown) as MatchKeysAndValues<String>,
        }
      );
      const res: IResponse = {
        status: Status.USER_EXISTS,
        message: JSON.stringify(userInfo.public),
      };
      return res;
    }
  }

  // receive user: only username and password field.
  public async getUserByUserNamePwd(user: any): Promise<any> {
    return this.collection
      .findOne(({
        "connection.username": JSON.parse(user).username,
        "connection.password": JSON.parse(user).password,
      } as unknown) as FilterQuery<string>) // filter pour username
      .then((userInfo: any) => {
        return userInfo;
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  // receive an userInfo / userConnect
  public async getUserByUsername(
    userInfo: any,
    purpose: Purpose
  ): Promise<any> {
    let username;
    if (purpose == Purpose.REGISTER) {
      username = JSON.parse(userInfo).connection.username;
    } else if (purpose == Purpose.LOGIN || purpose == Purpose.UPDATE) {
      username = JSON.parse(userInfo).username;
    }
    
    if ([
      "Botliver",
      "YanisBot",
      "NhienBot",
      "Botlice",
      "YuhanBot",
      "CharlesBot",
    ].includes(username) ) {
      return false;
    }
    return this.collection
      .findOne(({
        "connection.username": username,
      } as unknown) as FilterQuery<string>) // filter pour username
      .then((userInfo: any) => {
        return userInfo;
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  // receive an userInfo
  public async getUserByUsernameRegister(userInfo: any): Promise<any> {
    return this.collection
      .findOne(({
        "connection.username": JSON.parse(userInfo).connection.username,
      } as unknown) as FilterQuery<string>) // filter pour username
      .then((user: any) => {
        return user;
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  public async getUserByUsernameProfile(username: any): Promise<IUserInfo> {
    return this.collection
      .findOne(
        ({
          "public.username": JSON.parse(username),
        } as unknown) as FilterQuery<string>,
        { projection: { _id: 0 } as FindOneOptions<any> }
      )
      .then((user: any) => {
        return user;
      })
      .catch((error: Error) => {
        console.log("no");
        throw error;
      });
  }

  public async updateUserProfile(userProfileUpdate: any): Promise<IResponse> {
    const existingUser = await this.getUserByUsername(
      userProfileUpdate,
      Purpose.UPDATE
    );
    if (existingUser == null) {
      console.log("user for update not found");
      const res: IResponse = {
        status: Status.HTTP_NOT_FOUND,
        message: "User not found",
      };
      return res;
    } else {
      console.log("user updated");
      this.collection.findOneAndUpdate(
        ({
          "public.username": JSON.parse(userProfileUpdate).username,
        } as unknown) as FilterQuery<string>,
        {
          $set: ({
            "private.firstName": JSON.parse(userProfileUpdate).firstName,
            "private.lastName": JSON.parse(userProfileUpdate).lastName,
            "public.avatar": JSON.parse(userProfileUpdate).avatar,
            "public.title": JSON.parse(userProfileUpdate).title,
            "public.border": JSON.parse(userProfileUpdate).border,
          } as unknown) as MatchKeysAndValues<String>,
        }
      );
      const res: IResponse = {
        status: Status.UPDATE_OK,
        message: "User updated successfully.",
      };
      return res;
    }
  }

  // update in server for game stats.
  public async updateUserStats(userStatUpdate: any): Promise<IResponse> {
    const existingUser = await this.getUserByUsername(
      userStatUpdate,
      Purpose.UPDATE
    );
    if (existingUser == null) {
      console.log("user for update not found");
      const res: IResponse = {
        status: Status.HTTP_NOT_FOUND,
        message: "User not found",
      };
      return res;
    } else {
      console.log("user updated");
      this.collection.findOneAndUpdate(
        ({
          "public.username": JSON.parse(userStatUpdate).username,
        } as unknown) as FilterQuery<string>,
        {
          $set: ({
            [JSON.parse(userStatUpdate).field]: JSON.parse(userStatUpdate)
              .newValue,
          } as unknown) as MatchKeysAndValues<String>,
        }
      );
      const res: IResponse = {
        status: Status.UPDATE_OK,
        message: "User updated successfully.",
      };
      return res;
    }
  }

  public async getUserRooms(user: any): Promise<any> {
    return this.collection
      .findOne(
        { "public.username": JSON.parse(user).username } as FilterQuery<String>,
        { projection: { "connection.rooms": 1, _id: 0 } as FindOneOptions<any> }
      )
      .then((rooms: any) => {
        let roomData = JSON.parse(JSON.stringify(rooms));
        console.log(
          "userRoom:" + JSON.stringify(roomData["connection"]["rooms"])
        );
        return roomData["connection"]["rooms"];
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  public async getAllUserInfo(): Promise<string[]> {
    return (
      this.collection
        .find({})
        .toArray()
        // return this.collection.find({}, {projection: {_id : 0, public: 1, private: 1, connection: 1}}).toArray()
        .then((all: string[]) => {
          return all;
        })
        .catch((error: Error) => {
          throw error;
        })
    );
  }

  public async getUserAvatar(user: any): Promise<any> {
    return this.collection
      .findOne(
        { "public.username": JSON.parse(user).username } as FilterQuery<String>,
        { projection: { "public.avatar": 1, _id: 0 } as FindOneOptions<any> }
      )
      .then((avatar: any) => {
        return avatar;
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  public async getAllUserPublic(): Promise<any> {
    return this.collection
      .find({}, { projection: { public: 1, _id: 0 } })
      .toArray()
      .then((all: any[]) => {
        //TODO : WORKAROUND...voir comment enlever le public des resultats avec la query
        let userPublic: IUserInfo["public"][] = [];
        for (let user of all) {
          userPublic.push(user["public"]);
        }
        return userPublic;
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  public async addToAlbum(album: any): Promise<any> {
    return this.collection
      .findOneAndUpdate(
        {
          "public.username": JSON.parse(album).username,
        } as FilterQuery<String>,
        {
          $addToSet: ({
            "public.album": {
              drawing: JSON.parse(album).drawing,
              word: JSON.parse(album).word,
            },
          } as unknown) as undefined,
        }
      )
      .then((album: any) => {
        return album;
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  public async getUserAlbum(user: any): Promise<any> {
    return this.collection
      .findOne(
        { "public.username": JSON.parse(user).username } as FilterQuery<String>,
        { projection: { "public.album": 1, _id: 0 } as FindOneOptions<any> }
      )
      .then((album: any) => {
        return album;
      })
      .catch((error: Error) => {
        throw error;
      });
  }


  public async getAllUsername(): Promise<string[]> {
    return (
      this.collection
        .find({}, {projection: {_id : 0, "connection.username" : 1}})
        .toArray()
        .then((all: string[]) => {
          return all;
        })
        .catch((error: Error) => {
          throw error;
        })
    );
  }

  public async deleteUser(): Promise<any> {
    const users = await this.getAllUsername();
    const SAVE : string[] = ["charles", "nhien", "yuhan","q", "a", "t","c", "w", "oliver", "yanis", "tortue", "brr", "alice", "grr","900min 24h", "nouvelUtil"]; 

    for (var i = 0; i < users.length; i++) {
      const u = JSON.parse(JSON.stringify(users[i])).connection.username as string;
      if (!SAVE.includes(u)) {
        this.collection.findOneAndDelete({ "connection.username": u } as FilterQuery<String>) //DELETE HERE
      }
    }
  }

  public async disconnectAll(): Promise<any> {
    const users = await this.getAllUsername();

    for (var i = 0; i < users.length; i++) {
      const name = JSON.parse(JSON.stringify(users[i])).connection.username as string;
      this.collection.findOneAndUpdate(({"public.username": name} as unknown) as FilterQuery<string>,
        { 
          $set: ({ "connection.isConnected": false} as unknown) as MatchKeysAndValues<String>,
        });
    }
  }

  public async deleteDrawing(drawing: any): Promise<any> {
    return this.collection
      .findOneAndUpdate(
        {
          "public.username": JSON.parse(drawing).username,
        } as FilterQuery<String>,
        {
          $pull: ({
            "public.album": { drawing: JSON.parse(drawing).drawing },
          } as unknown) as undefined,
        }
      )
      .then((drawing: any) => {
        return drawing;
      })
      .catch((error: Error) => {
        throw error;
      });
  }
}
