import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { DatabaseService } from './../services/database.service';
import Types from './../types';

@injectable()
export class DatabaseController {

    public router: Router;
    public constructor(@inject(Types.DatabaseService) private databaseService: DatabaseService, ) {
        this.configureRouter();
    }

    // tslint:disable-next-line: max-func-body-length
    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            res.json("Welcome to PAINseau database.");
        });

        this.router.get('/clear', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.collection.deleteMany({}).catch((error: Error) => {
                console.log('ERROR ' + error);
            });
        });

        this.router.get('/usernames', async (req: Request, res: Response, next: NextFunction) => {
            console.log('usernames sucess');
            this.databaseService.getAllUsernames()
            .then((usernames: string[]) => {
                res.json(usernames);
            })
            .catch((reason: unknown) => {
                res.json('errorMessage');
            });

        });

        this.router.post('/insert', async (req: Request, res: Response, next: NextFunction) => {
            // SEND ENTIRE BODY INSTEAD OF USERNAME STRING

            this.databaseService.addUsername(JSON.stringify(req.body))
                // tslint:disable-next-line: typedef
                .then((usernames) => {
                    res.json(usernames);
                })
                .catch((reason: unknown) => {
                    console.log('INSERT FAIL ' + reason);
                    res.json(reason);
                });
        });

        this.router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.getAllUsernames()
                .then((usernames: string[]) => {
                    res.json(usernames);
                })
                .catch((reason: unknown) => {
                    res.json('errorMessage');
                });
        });

        this.router.post('/delete', async (req: Request, res: Response, next: NextFunction) => {
            // this.databaseService.deleteDrawing(req.body.id);
            res.end('Delete succes');
        });

    }
}
