import {injectable} from 'inversify';
import 'reflect-metadata';
import {Image} from '../../../common/image';
import * as fs from 'fs';

const VIDE = "";
const PATHDATA = "./app/DATABASE/images.txt";
const REGEX = /[\r\n]+/;
const NOUVELLELIGNE = "\r\n";
const UTF8 ="utf-8";
const VIRGULE = ",";

@injectable()
export class ListesService {
    listesImages: Image[]; 
    listesRAW: string[]
    titre: string;
    liste: string[];
    svg: string;
    imageReduite: string;
    idSvg: string[];

    constructor(){
        this.listesImages = new Array<Image>();
        this.listesRAW = new Array<string>();
        this.liste = new Array<string>();
        this.idSvg = new Array<string>();
        this.titre = VIDE;
        this.svg = VIDE;
        this.imageReduite = VIDE;
    }

    setListes(): void{
        this.listesImages = new Array<Image>();
        this.listesRAW = new Array<string>();
        const fichier = fs.readFileSync(PATHDATA, UTF8);
        for (const ligne of fichier.split(REGEX)){
            this.listesRAW.push(ligne);
        }
        let liste = new Array<string>();
        this.idSvg = new Array<string>();
        for (let ligne of this.listesRAW) {
            liste = ligne.split(VIRGULE);
            let svgNbr = liste[0];
            let titre = liste[1];
            let etiquette = new Array<string> ();
            let date = "";
            this.idSvg.push(svgNbr);
            const fichiersvg = fs.readFileSync(`./app/DATABASE/${svgNbr}.svg`, UTF8);
            for (let i = 2; i < liste.length; i++) {
                etiquette.push(liste[i]);
            }
            this.listesImages.push({
                _id: svgNbr,
                svg: fichiersvg,
                titre,
                etiquette,
                date}
            );
        }
    }

    async sauvegarde(nouvelleImage: string, svgImage: string): Promise<string> {
        let idNouvelleImage = "";
        this.svg = VIDE;
        fs.appendFileSync(PATHDATA, NOUVELLELIGNE);
        let idValeur = this.idSvg.length + 1;
        idNouvelleImage += idValeur.toString();
        idNouvelleImage += VIRGULE;
        idNouvelleImage += nouvelleImage;
        this.svg = svgImage;
        fs.writeFileSync(`./app/DATABASE/${idValeur}.svg`, this.svg , UTF8);
        fs.appendFileSync(PATHDATA, idNouvelleImage);
        return "reussi";
         
    }

    async getImage(id: string): Promise<Image> {
        return new Promise((resolve, reject) => {
            for(let i=0; i<this.listesImages.length; i++){
                if(id === this.listesImages[i]._id) {
                    resolve(this.listesImages[i]);
                }
            }
            reject();
        })
    }

    async getListes(): Promise<Image[]>{
        this.setListes();
        return this.listesImages;
    }
}