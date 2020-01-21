import { injectable } from 'inversify';
import { Image, ImageSansId } from "../../../common/image";
import { Collection, MongoClient, MongoClientOptions, ObjectId} from 'mongodb';
import 'reflect-metadata';

// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://admin:admin@cluster0-d8pap.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE_NAME = 'Projet_2_BD';
const DATABASE_COLLECTION = 'Image';
const VIDE = "";
const VIRGULE = ",";
const ERREUR = "Impossible de supprimer l'image"
const UN = 1;
const ZERO = 0;

@injectable()
export class DatabaseService {
  
    collection: Collection<Image>;
    imageSansId: ImageSansId;
    listeEtiquettes: Array<string>;

    private options: MongoClientOptions = {
        useNewUrlParser : true
        };

    constructor() {
        this.listeEtiquettes = new Array<string>();
        MongoClient.connect(DATABASE_URL, this.options)
            .then((client: MongoClient) => {
                this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
            })
            .catch((err) => {
                process.exit(1);
            });
    }

    async getImages(): Promise<Image[]> {
        return  this.collection.find({}).toArray()
                .then((images:Image[])=>{
                    return images;
                })
                .catch((error: Error) => {
                    throw error;
                });
    }

    getImageAvecId(_id:string):Promise<Image|null>{
        return  this.collection.findOne({_id: new ObjectId(_id) as any});
    }

    async sauvegarde(titre: string, svgImage: string, etiquette: string): Promise<void>{
        this.listeEtiquettes = this.etiquettesEnArray(etiquette);
        let allo = this.ajoutDate();
        this.imageSansId = {
            titre: titre,
            svg: svgImage,
            etiquette: this.listeEtiquettes,
            date: allo
        }
        this.collection.insertOne(this.imageSansId).catch((error:Error)=>{
            throw error;
        });
    }
    

    async supprimer(id:string): Promise<void>{
        return this.collection
            .findOneAndDelete({ _id: new ObjectId(id) as any })
        .then(() => { })
        .catch((error: Error) => {
            throw new Error(ERREUR);
        });
    }

    etiquettesEnArray(etiquettes: string): Array<string>{
        let listeEtiquettes = new Array<string>();
        let uneEtiquette: string = VIDE;
        for(let i=ZERO; i<etiquettes.length+UN; i++){
            if(etiquettes.charAt(i).match(VIRGULE) || i === etiquettes.length){
                listeEtiquettes.push(uneEtiquette);
                uneEtiquette =VIDE;
            } else {
                uneEtiquette +=etiquettes.charAt(i);
            }
        }
        return listeEtiquettes
    }

    ajoutDate(): string {
        let date: Date = new Date();
        let aujourdhui = date.toLocaleString();
        return aujourdhui
    }
}
