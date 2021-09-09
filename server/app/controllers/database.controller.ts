import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { IGame } from "../interfaces/IGame";
import { IUserInfo } from "../interfaces/IUserInfo";
import { DatabaseGameService } from "../services/database-game.service";
import { DatabaseLobbyService } from "../services/database-lobby.service";
import { DatabaseRoomService } from "../services/database-room.service";
import { DatabaseUserService } from "../services/database-user.service";
import { DatabaseWordImageService } from "../services/database-wordImage.service";
import Types from "./../types";

@injectable()
export class DatabaseController {
  public router: Router;
  public constructor(
    @inject(Types.DatabaseRoomService)
    private databaseRoomService: DatabaseRoomService,
    @inject(Types.DatabaseUserService)
    private databaseUserService: DatabaseUserService,
    @inject(Types.DatabaseLobbyService)
    private databaseLobbyService: DatabaseLobbyService,
    @inject(Types.DatabaseGameService)
    private databaseGameService: DatabaseGameService,
    @inject(Types.DatabaseWordImageService)
    private databaseWordImageService: DatabaseWordImageService
  ) {
    this.configureRouter();
  }

  // tslint:disable-next-line: max-func-body-length
  private configureRouter(): void {
    this.router = Router();

    this.router.get(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        res.json("Welcome to PAINseau database.");
      }
    );

    this.router.get(
      "/clearLobbies",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseLobbyService.collection
          .deleteMany({})
          .catch((error: Error) => {
            console.log("ERROR " + error);
          });
      }
    );

    this.router.get(
      "/clearUsers",
      async (req: Request, res: Response, next: NextFunction) => {

        this.databaseUserService.deleteUser().catch((error: Error) => {
          console.log("ERROR " + error);
        });
        // this.databaseUserService.collection
        //   .deleteMany({})
        //   .catch((error: Error) => {
        //     console.log("ERROR " + error);
        //   });
      }
    );

    this.router.get(
      "/disconnect",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseUserService.disconnectAll().catch((error: Error) => {
          console.log("ERROR " + error);
        });
      }
    );

    // -- USER ----------------------------------------------------------------------------------------------
    // receives userInfo
    this.router.post(
      "/registerUserInfo",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseUserService
          .registerUser(JSON.stringify(req.body))
          // tslint:disable-next-line: typedef
          .then((usernames) => {
            res.json(usernames);
          })
          .catch((reason: unknown) => {
            console.log("INSERT register FAIL " + reason);
            res.json(reason);
          });
      }
    );

    this.router.patch(
      "/updateUserInfo",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseUserService
          .updateUserProfile(JSON.stringify(req.body))
          .then((response) => {
            res.json(response);
          })
          .catch((reason: unknown) => {
            res.json(reason);
          });
      }
    );

    this.router.post(
      "/login",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseUserService
          .login(JSON.stringify(req.body))
          .then((response) => {
            res.json(response);
          })
          .catch((reason: unknown) => {
            res.json(reason);
          });
      }
    );

    this.router.get(
      "/all-users",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseUserService
          .getAllUserInfo()
          .then((allUserInfo: string[]) => {
            res.json(allUserInfo);
          })
          .catch((reason: unknown) => {
            res.json("errorMessage");
          });
      }
    );

    this.router.get(
      "/user-avatar",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseUserService
          .getUserAvatar(JSON.stringify(req.query))
          .then((avatar: any) => {
            res.json(avatar);
          })
          .catch((reason: unknown) => {
            res.json("errorMessage " + reason);
          });
      }
    );

    this.router.post(
      "/insert-album",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseUserService
          .addToAlbum(JSON.stringify(req.body))
          .then((response) => {
            res.json(response);
          })
          .catch((reason: unknown) => {
            res.json(reason);
          });
      }
    );

    this.router.get(
      "/user-album",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseUserService
          .getUserAlbum(JSON.stringify(req.query))
          .then((album: any) => {
            res.json(album);
          })
          .catch((reason: unknown) => {
            res.json("errorMessage " + reason);
          });
      }
    );

    this.router.delete(
      "/delete-drawing",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseUserService
          .deleteDrawing(JSON.stringify(req.query))
          .then((drawing: any) => {
            res.json(drawing);
          })
          .catch((reason: unknown) => {
            res.json("errorMessage " + reason);
          });
      }
    );

    this.router.get(
      "/all-usersPublic",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseUserService
          .getAllUserPublic()
          .then((publicInfo: []) => {
            res.json(publicInfo);
          })
          .catch((reason: unknown) => {
            res.json("errorMessage" + reason);
          });
      }
    );

    // -- ROOM ----------------------------------------------------------------------------------------------
    this.router.post(
      "/join-chatroom",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseRoomService
          .joinRoom(JSON.stringify(req.body))
          .then((response) => {
            res.json(response);
          })
          .catch((reason: unknown) => {
            res.json(reason);
          });
      }
    );

    this.router.post(
      "/quit-chatroom",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseRoomService
          .quitRoom(JSON.stringify(req.body))
          .then((response) => {
            res.json(response);
          })
          .catch((reason: unknown) => {
            res.json(reason);
          });
      }
    );

    this.router.post(
      "/insert-room",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseRoomService
          .addRoom(JSON.stringify(req.body))
          // tslint:disable-next-line: typedef
          .then((room) => {
            res.json(room);
          })
          .catch((reason: unknown) => {
            console.log("INSERT FAIL " + reason);
            res.json(reason);
          });
      }
    );

    this.router.get(
      "/all-rooms",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseRoomService
          .getAllRooms()
          .then((rooms: []) => {
            res.json(rooms);
          })
          .catch((reason: unknown) => {
            res.json("errorMessage");
          });
      }
    );

    this.router.get(
      "/user-rooms",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseUserService
          .getUserRooms(JSON.stringify(req.query))
          .then((rooms: any) => {
            res.json(rooms);
          })
          .catch((reason: unknown) => {
            res.json("errorMessage " + reason);
          });
      }
    );

    this.router.get(
      "/room",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseRoomService
          .getRoom(JSON.stringify(req.query))
          .then((room: any) => {
            if (room != null) {
              res.json(true);
            } else {
              res.json(false);
            }
          })
          .catch((reason: unknown) => {
            res.json("errorMessage " + reason);
          });
      }
    );

    this.router.get(
      "/room-history",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseRoomService
          .getHistoryRoom(JSON.stringify(req.query))
          .then((history: any) => {
            res.json(history);
          })
          .catch((reason: unknown) => {
            res.json("errorMessage " + reason);
          });
      }
    );

    // -- LOBBIES ---------------------------------------------------------------------------------------------
    this.router.post(
      "/insert-lobby",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseLobbyService
          .addLobby(JSON.stringify(req.body))
          // tslint:disable-next-line: typedef
          .then((lobby) => {
            res.json(lobby);
          })
          .catch((reason: unknown) => {
            console.log("INSERT FAIL LOBBY " + reason);
            res.json(reason);
          });
      }
    );

    this.router.get(
      "/all-lobbies",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseLobbyService
          .getAllLobbies()
          .then((lobbies: []) => {
            //console.log("all lobbies:" + JSON.stringify(lobbies));
            res.json(lobbies);
          })
          .catch((reason: unknown) => {
            res.json("errorMessage");
          });
      }
    );

    //verify max capacity in a lobby
    this.router.post(
      "/lobby-users",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseLobbyService
          .getLobbyUsers(JSON.stringify(req.body))
          // tslint:disable-next-line: typedef
          .then((users) => {
            res.json(users);
          })
          .catch((reason: unknown) => {
            console.log("error " + reason);
            res.json(reason);
          });
      }
    );

    // to get the members present within a lobby
    this.router.get(
      "/lobby-players",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseLobbyService
          .getLobbyPlayersDisplay(JSON.stringify(req.query))
          .then((users) => {
            res.json(users);
          })
          .catch((reason: unknown) => {
            res.json("errorMessage");
          });
      }
    );

    this.router.post(
      "/delete",
      async (req: Request, res: Response, next: NextFunction) => {
        // this.databaseService.deleteDrawing(req.body.id);
        res.end("Delete succes");
      }
    );

    // retrieve userInfo
    this.router.get(
      "/retrieveUserInfo",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseUserService
          .getUserByUsernameProfile(JSON.stringify(req.query.username))
          .then((user: IUserInfo) => {
            res.json(user);
          })
          .catch((reason: unknown) => {
            res.json(reason);
          });
      }
    );

    //games

    this.router.post(
      "/insert-game",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseGameService
          .addGame(JSON.stringify(req.body))
          .then((game) => {
            res.json(game);
          })
          .catch((reason: unknown) => {
            res.json(reason);
          });
      }
    );

    this.router.get(
      "/game-host",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseGameService
          .getGameByHost(JSON.stringify(req.query))
          .then((game: IGame) => {
            res.json(game);
          })
          .catch((reason: unknown) => {
            res.json(reason);
          });
      }
    );

    // -- WORD-IMAGE ---------------------------------------------------------------------------------------------

    this.router.post(
      "/insert-wordImage",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseWordImageService
          .addWordImage(JSON.stringify(req.body))
          .then((wordImage) => {
            res.json(wordImage);
          })
          .catch((reason: unknown) => {
            res.json(reason);
          });
      }
    );

    this.router.get(
      "/get-wordImage",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseWordImageService
          .getWordImage(JSON.stringify(req.query))
          .then((wordImage) => {
            res.json(wordImage);
          })
          .catch((reason: unknown) => {
            res.json(reason);
          });
      }
    );

    this.router.get(
      "/all-wordImages",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseWordImageService
          .getAllWordImages()
          .then((wordImages) => {
            res.json(wordImages);
          })
          .catch((reason: unknown) => {
            res.json(reason);
          });
      }
    );

    this.router.get(
      "/all-words",
      async (req: Request, res: Response, next: NextFunction) => {
        this.databaseWordImageService
          .getAllWords()
          .then((wordImages) => {
            res.json(wordImages);
          })
          .catch((reason: unknown) => {
            res.json(reason);
          });
      }
    );
  }
}
