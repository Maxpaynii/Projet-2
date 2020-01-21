import {Container} from 'inversify';
import {Application} from './app';
import {Server} from './server';
import Types from './types';
import { ListesController } from './controllers/listes.controller';
import { ListesService } from './services/listes.service';
import {DatabaseController } from './controllers/database.controller';
import {DatabaseService} from './services/database.service';

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);

container.bind(Types.ListesController).to(ListesController);
container.bind(Types.ListesService).to(ListesService);

container.bind(Types.DatabaseController).to(DatabaseController);
container.bind(Types.DatabaseService).to(DatabaseService);


export {container};
