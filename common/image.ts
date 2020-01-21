import { SafeHtml } from '../client/node_modules/@angular/platform-browser';
import { Trace } from '../client/src/Trace';

export interface Image {
    svg: string,
    titre: string,
    etiquette: string[],
    _id: string,
    date: string
}
export interface ImageSansId {
    svg: string,
    titre: string,
    etiquette: string[],
    date: string,
}

export interface ImageVisible {
    svg: SafeHtml;
    titre: string,
    etiquette: string[],
    _id: string,
    date: string
}

export interface StringImage {
    image: string;
}

export interface ImageCharger {
    hauteur: string;
    largeur: string;
    couleur: string;
    trace: Trace[];
    texte: TexteCharger[];
}

export interface TexteCharger {
    x: string;
    y: string;
    fill: string;
    family: string;
    anchor: string;
    size: string;
    weight: string;
    style: string;
    texte: string;
}