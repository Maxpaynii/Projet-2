import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import Types from '../types';
import {DatabaseService} from '../services/database.service';
import { inject, injectable } from 'inversify';
import {Image} from '../../../common/image';


@injectable()
export class DatabaseController {

    router: Router;

    constructor(
      @inject(Types.DatabaseService) private databaseService: DatabaseService) {
      this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get("/images", async (req: Request, res: Response, next: NextFunction)=>{
            this.databaseService.getImages()
                .then((image:Image[])=>{
                    res.json(image);
                })
                .catch((error:Error)=> {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.get("/images/:id", async (req: Request, res: Response, next:NextFunction)=>{
            this.databaseService.getImageAvecId(req.params.id)
                .then((image:Image)=>{
                    res.json(image);
                })
                .catch((error:Error)=> {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.post("/sauvegarde", async (req: Request, res: Response, next: NextFunction)=>{
            this.databaseService.sauvegarde(req.body.titre as string, req.body.svgImage as string, req.body.etiquettes as string)
                .then(()=>{
                    res.sendStatus(Httpstatus.CREATED).send();
                })
                .catch((error:Error)=> {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete("/supprimer/:id", async (req: Request, res: Response, next: NextFunction)=>{
            this.databaseService.supprimer(req.params.id as string)
                .then(()=>{
                    res.sendStatus(Httpstatus.NO_CONTENT).send();
                })
                .catch((error:Error)=> {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });
    }
}