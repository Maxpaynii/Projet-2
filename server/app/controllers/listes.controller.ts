import {NextFunction, Request, Response, Router} from 'express';
import {inject, injectable} from 'inversify';
import Types from '../types';
import {ListesService} from '../services/listes.service';
import {Message} from '../../../common/communication/message';
import {Image} from '../../../common/image';

@injectable()
export class ListesController {

    public router: Router;
    

    constructor(@inject(Types.ListesService) private listesService: ListesService) {
        this.configureRouter();
    }

    private configureRouter() {
        this.router = Router();
        this.router.get('/',
            (req: Request, res: Response, next: NextFunction) => {
                this.listesService.getListes().then((time: Image[]) => { //Si erreur sur time:Image[], rajouter une ligne puis la supprimer
                    res.json(time);
                }).catch((reason: unknown) => {
                    const errorMessage: Message = {
                        title: `Error`,
                        body: reason as string,
                    };
                    res.json(errorMessage);
                });
            });
        this.router.post('/sauvegarde', (req: Request, res:Response) => {
                this.listesService.sauvegarde(req.body.nouvelleImage as string, req.body.svgImage as string);
            });
        this.router.get('/image/:id', (req: Request, res: Response) => {
            this.listesService.getImage(req.params['id'] || '').then((time: Image) => {
                res.json(time);
            }).catch((reason: unknown) => {
                const errorMessage: Message = {
                    title: `Error`,
                    body: reason as string,
                };
                res.json(errorMessage);
            });
        });
    }
}